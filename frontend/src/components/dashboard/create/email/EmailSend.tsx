import React, { useContext, useState, useEffect } from 'react'

import { ModalContext } from 'contexts/modal.context'
import ConfirmModal from 'components/dashboard/confirm-modal'
import { useParams } from 'react-router-dom'

import { PreviewBlock, PrimaryButton } from 'components/common'
import { getPreviewMessage } from 'services/email.service'
import styles from '../Create.module.scss'

const EmailSend = ({ numRecipients }: { numRecipients: number }) => {

  const modalContext = useContext(ModalContext)
  const [preview, setPreview] = useState({} as { body: string; subject: string })
  const { id: campaignId } = useParams()

  if (!campaignId) {
    throw new Error('Invalid campaign id')
  }

  useEffect(() => {
    loadPreview()
  }, [campaignId])

  async function loadPreview() {
    if (campaignId) {
      const msgPreview = await getPreviewMessage(+campaignId)
      if (msgPreview) {
        setPreview(msgPreview)
      }
    }
  }

  const openModal = () => {
    modalContext.setModalContent(
      <ConfirmModal campaignId={+campaignId} sendRate={0}></ConfirmModal>
    )
  }

  return (
    <>
      <sub>Step 4</sub>
      <h2>Your campaign is ready to be sent!</h2>
      <div className="separator"></div>

      <div className={styles.sendInfo}>
        <p className={styles.greyText}>Number of recipients</p>
        <h4>{numRecipients}</h4>

        <p className={styles.greyText}>Message</p>
        <PreviewBlock body={preview.body} subject={preview.subject} />
      </div>

      <div className="separator"></div>

      <div className="progress-button">
        <PrimaryButton className={styles.turquoiseGreenBtn} onClick={openModal}>
          Send campaign now
          <i className="bx bx-send"></i>
        </PrimaryButton>
      </div>
    </>
  )
}

export default EmailSend