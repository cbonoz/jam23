import { Button, Result, Spin } from 'antd'
import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router'
import { purchaseContract } from '../contract/huddleContract'
import { getMetadata, purchaseDataset } from '../contract/huddleContract'

export default function PurchaseStream({ }) {
  const [error, setError] = useState()
  const [result, setResult] = useState()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState()

  const params = useParams()
  const { contractAddress } = params

  async function purchase() {
    // TODO: add error check for preset location if user denied permission or location not retrievable.
    setLoading(true)
    const { priceWei } = data
    try {
      const res = await purchaseContract(contractAddress, priceWei)
      setResult({ ...res })
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
      // const res = await getMetadata(contractAddress);
      // TODO
      const res = {}
      setData(res)
    } catch (e) {
      console.error('error fetching record', e)
      let { message } = e
      // setError(humanError(message))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (contractAddress) {
      getDatasetInfo()
    }
  }, [contractAddress])

  if (loading) {
    return <Spin size="large" className='boxed' />
  }

  if (error) {
    return <div className='error-text boxed'>
      {error}
    </div>
  }

  const isReady = !loading && data?.priceEth

  return (
    <div className='boxed'>
      {data && <div className='centered card boxed'>
        <h4 className='centered success-text'>data available for purchase</h4>
        <h2>{data.title}</h2>
        <p>{data.description}</p>
        {data.createdAt && <p>Created: {data.createdAt}</p>}
        {data.purchases && <p>Purchases: {data.purchases}</p>}
        {data.priceEth && <p>Price: {data.priceEth} Eth</p>}


        {isReady && <Button type="primary" size="large" loading={loading} onClick={purchase}>
          Purchase dataset
        </Button>}

        {result && <Result status="success" title="Event recorded!"
          subTitle={`TX: ${result.hash}`}
          extra={[
            <p>{JSON.stringify(result)}</p>
            // <Button type="primary" key="console" onClick={() => {
            //   window.open(result.contractUrl, "_blank")
            // }}>
            //   View contract
            // </Button>,
          ]} />}

      </div>}

    </div>
  )
}