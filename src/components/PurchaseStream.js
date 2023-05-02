import { Web3Button } from '@web3modal/react'
import {useSigner} from 'wagmi'
import { Button, Result, Spin } from 'antd'
import TextArea from 'antd/lib/input/TextArea'
import React, {useState, useEffect} from 'react'
import { useParams } from 'react-router'
import { EXAMPLE_FORM, EXAMPLE_RESPONSE } from '../constants'
import { getMetadata, purchaseDataset, recordDatasetEvent } from '../contract/dataContract'
import { humanError, ipfsUrl } from '../util'
import { FileDrop } from './FileDrop/FileDrop'

export default function PurchaseStream({network, account}) {
  const { data: signer, error: signerError, isLoading, refetch } = useSigner()

  const [error, setError] = useState()
  const [result, setResult] = useState()
  const [loading, setLoading] = useState(false)
  const [dataset, setDataset] = useState()

  const params = useParams()
  const {contractAddress} = params

   async function purchase() {
    // TODO: add error check for preset location if user denied permission or location not retrievable.
    setLoading(true)
    const {priceWei} = dataset
    try {
      const res = await purchaseDataset(signer, contractAddress, priceWei)
      setResult({...res})
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  } 

  async function getDatasetInfo() {
    setError(undefined)
    setLoading(true)
    try {
      const res = await getMetadata(signer, contractAddress);
      setDataset(res?.data || {})
    } catch (e) {
      console.error('error fetching record', e)
      let { message } = e
      // setError(humanError(message))
      setDataset(EXAMPLE_RESPONSE)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (signer) {
      getDatasetInfo()
    }
  }, [contractAddress, signer])

  if (loading) {
    return <Spin size="large" className='boxed'/>
  }

  if (error) {
    return <div className='error-text boxed'>
      {error}
    </div>
  }

  const isReady = !loading && dataset?.priceEth

  return (
    <div className='boxed'>
      {dataset && <div className='centered card boxed'>
        <h4 className='centered success-text'>Dataset available for purchase</h4>
        <h2>{dataset.title}</h2>
        <p>{dataset.description}</p>
        {dataset.createdAt && <p>Created: {dataset.createdAt}</p>}
        {dataset.purchases && <p>Purchases: {dataset.purchases}</p>}
        {dataset.priceEth && <p>Price: {dataset.priceEth} Eth</p>}


      {isReady && <Button type="primary" size="large" loading={loading} onClick={purchase}>
        Purchase dataset
      </Button>}

      {!isReady && <div><Web3Button/></div>}
      {result && <Result status="success" title="Event recorded!"
      subTitle={`TX: ${result.hash}`}
        extra={[
          <p>{JSON.stringify(result)}</p>
      // <Button type="primary" key="console" onClick={() => {
      //   window.open(result.contractUrl, "_blank")
      // }}>
      //   View contract
      // </Button>,
    ]}/>}

      </div>}

    </div>
  )
}