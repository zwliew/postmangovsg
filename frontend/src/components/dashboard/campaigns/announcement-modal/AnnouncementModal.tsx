import React, { useContext, useState, useEffect } from 'react'
import cx from 'classnames'
import { updateAnnouncementVersion } from 'services/settings.service'

import { PrimaryButton, ErrorBlock, TextButton } from 'components/common'
import { ModalContext } from 'contexts/modal.context'

import styles from './AnnouncementModal.module.scss'
import { i18n } from 'locales'
import { ANNOUNCEMENT } from 'config'
import { OutboundLink } from 'react-ga'
import ReactPlayer from 'react-player/lazy'

function isVideoUrl(url: string) {
  url = url.toLowerCase()
  const VIDEO_EXTENSIONS = ['mp4']
  return VIDEO_EXTENSIONS.some((extension) => url.endsWith(`.${extension}`))
}

const AnnouncementModal = () => {
  const { close, setBeforeClose } = useContext(ModalContext)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    setBeforeClose(() => async () => {
      try {
        await updateAnnouncementVersion(await ANNOUNCEMENT.version)
      } catch (err) {
        setErrorMessage(err.message)
      }
    })
  }, [setBeforeClose])

  async function onReadMoreClicked(): Promise<void> {
    try {
      // Closes the modal
      await close()
    } catch (err) {
      setErrorMessage(err.message)
    }
  }

  const mediaUrl = i18n._(ANNOUNCEMENT.mediaUrl)
  let mediaAndTitle = null
  if (isVideoUrl(mediaUrl)) {
    mediaAndTitle = (
      <>
        <h4 className={styles.titleTop}>{i18n._(ANNOUNCEMENT.title)}</h4>
        <ReactPlayer
          url={mediaUrl}
          className={styles.modalMedia}
          controls
          playing
        />
      </>
    )
  } else {
    mediaAndTitle = (
      <>
        <img
          className={styles.modalMedia}
          src={mediaUrl}
          alt="Modal graphic"
        ></img>
        <h4 className={styles.titleCentered}>{i18n._(ANNOUNCEMENT.title)}</h4>
      </>
    )
  }

  // Only render the secondary link if both the text and URL are non-empty
  const EMPTY_TRANSLATION = '~empty~'
  const secondaryButtonText = i18n._(ANNOUNCEMENT.secondaryButtonText)
  const secondaryButtonUrl = i18n._(ANNOUNCEMENT.secondaryButtonUrl)
  let secondaryLink = null
  if (
    secondaryButtonUrl !== EMPTY_TRANSLATION &&
    secondaryButtonText !== EMPTY_TRANSLATION
  ) {
    secondaryLink = (
      <OutboundLink
        eventLabel={secondaryButtonUrl}
        to={secondaryButtonUrl}
        target="_blank"
      >
        <TextButton minButtonWidth onClick={onReadMoreClicked}>
          {secondaryButtonText}
        </TextButton>
      </OutboundLink>
    )
  }

  return (
    <div className={styles.modal}>
      {mediaAndTitle}
      <div className={styles.content}>{i18n._(ANNOUNCEMENT.subtext)}</div>
      <div className={styles.options}>
        {secondaryLink}
        <OutboundLink
          eventLabel={i18n._(ANNOUNCEMENT.primaryButtonUrl)}
          to={i18n._(ANNOUNCEMENT.primaryButtonUrl)}
          target="_blank"
        >
          <PrimaryButton onClick={onReadMoreClicked}>
            <span>{i18n._(ANNOUNCEMENT.primaryButtonText)}</span>
            <i className={cx('bx', styles.icon, 'bx-right-arrow-alt')}></i>
          </PrimaryButton>
        </OutboundLink>{' '}
      </div>
      <ErrorBlock>{errorMessage}</ErrorBlock>
    </div>
  )
}

export default AnnouncementModal
