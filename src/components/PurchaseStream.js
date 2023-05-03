import { Button, Card, Result, Spin } from 'antd'
import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router'
import { purchaseContract } from '../contract/huddleContract'
import { getMetadata, purchaseDataset } from '../contract/huddleContract'
import { ACTIVE_NETWORK, APP_NAME } from '../util/constants'
import { ethers } from 'ethers'
import { getRpcError, transactionUrl } from '../util'

export default function PurchaseStream({ account }) {
  const [error, setError] = useState()
  const [result, setResult] = useState()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState()

  const params = useParams()
  const { contractAddress } = params

  async function purchase() {
    // TODO: add error check for preset location if user denied permission or location not retrievable.
    setLoading(true)
    try {
      const res = await purchaseContract(contractAddress, data.priceEth)
      setResult({ ...res, url: data?.url })
    } catch (e) {
      setError(getRpcError(e))
    } finally {
      setLoading(false)
    }
  }

  async function getDatasetInfo() {
    setError(undefined)
    setLoading(true)
    try {
      const res = await getMetadata(contractAddress);
      const d = {
        title: res[0],
        url: res[1],
        creator: res[2],
        payableAddress: res[3],
        priceEth: ethers.utils.formatEther(res[4].toString())
      }
      d['priceWei'] = ethers.utils.parseUnits(d.priceEth.toString(),"ether").toString()
      setData(d)
    } catch (e) {
      console.error('error fetching record', e)
      let { message } = e
      setError(getRpcError(e))
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
    return <div>
      <Card title="Error completing request">
      <p className='error-text'>{error}</p>
      </Card>
    </div>
  }

  const isReady = !loading && data?.priceEth
  const isPurchased = !!result

  return (
    <div className='boxed'>
      {data && <div className='centered card boxed'>
        <Card className='centered success-text' title={`Available for purchase`}>
        {/* {JSON.stringify(data)} */}
        {/* <p>Available for purchase</p> */}
        <h2>{data.title}</h2>
        <h3>Creator: {data.creator}</h3>
        <p>{data.description}</p>
        {data.createdAt && <p>Created: {data.createdAt}</p>}
        {data.priceEth && <p>Price: {data.priceEth} {ACTIVE_NETWORK.currency}</p>}


        {!isPurchased && isReady && <Button disabled={!account} type="primary" size="large" loading={loading} onClick={purchase}>
          Purchase content
        </Button>}
</Card>
        {result && <Result status="success" title="Purchase complete!"
          subTitle={`TX: ${result.hash}`}
          extra={[
            <Button type="primary" key="console" onClick={() => {
              window.open(result.url, "_blank")
            }}>
              View files
            </Button>,
                 <Button key="console" onClick={() => {
                  window.open(transactionUrl(result.hash), "_blank")
                }}>
                  View transaction
                </Button>,
          ]} />}

      </div>}

    </div>
  )
}