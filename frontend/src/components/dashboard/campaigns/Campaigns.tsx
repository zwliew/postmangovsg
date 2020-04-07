import React, { useEffect, useState } from 'react'

import { Campaign, ChannelType } from 'models/Campaign'
import { getCampaigns } from 'services/campaign.service'
import Pagination from 'components/common/pagination'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelopeOpen, faCommentAlt } from '@fortawesome/free-solid-svg-icons'
import styles from './Campaigns.module.scss'

const ITEMS_PER_PAGE = 1

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState(new Array<Campaign>())
  const [campaignsDisplayed, setCampaignsDisplayed] = useState(new Array<Campaign>())
  const [selectedPage, setSelectedPage] = useState(0)

  async function fetchCampaigns() {
    const campaigns = await getCampaigns()
    setCampaigns(campaigns)
  }

  useEffect(() => {
    fetchCampaigns()
  }, [])

  useEffect(() => {
    const offset = selectedPage * ITEMS_PER_PAGE
    setCampaignsDisplayed(campaigns.slice(offset, offset + ITEMS_PER_PAGE))
  }, [campaigns, selectedPage])

  const modeIcons: any = {
    [ChannelType.EMAIL]: (
      <FontAwesomeIcon className={styles.icon} icon={faEnvelopeOpen} />
    ),
    [ChannelType.SMS]: (
      <FontAwesomeIcon className={styles.icon} icon={faCommentAlt} />
    ),
  }

  return (
    <div className={styles.content}>
      <h2 className={styles.title}>{campaigns.length} past campaigns</h2>

      {
        campaigns.length
          ? (
            <>
              <div className={styles.table}>
                <div className={[styles.row, styles.header].join(' ')}>
                  <p className={styles.column}>Mode</p>
                  <p className={styles.column}>Name</p>
                  <p className={styles.column}>Time Sent</p>
                  <p className={styles.column}>Messages Sent</p>
                  <p className={styles.column}>Status</p>
                </div>

                {
                  campaignsDisplayed.map((item: any, index: number) =>
                    <div className={[styles.row, styles.body].join(' ')} key={index}>
                      <div className={styles.column}>
                        <span className={styles.icon}>{modeIcons[item.type]}</span>
                      </div>
                      <p className={styles.column}>{item.name}</p>
                      <p className={styles.column}>{item.timeSent}</p>
                      <p className={styles.column}>{item.msgsSent}</p>
                      <p className={styles.column}>{item.status}</p>
                    </div>
                  )
                }
              </div>

              <Pagination
                itemsCount={campaigns.length}
                setSelectedPage={setSelectedPage}
                itemsPerPage={ITEMS_PER_PAGE}
              ></Pagination>
            </>
          )
          : ''
      }
    </div>
  )
}

export default Campaigns
