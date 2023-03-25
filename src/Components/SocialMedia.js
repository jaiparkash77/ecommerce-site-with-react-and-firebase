import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faYoutube,
  faFacebook,
  faTwitter,
  faInstagram
} from "@fortawesome/free-brands-svg-icons";

export const SocialMedia = () => {
  return (
    <>
        <p className="social-container">
        <a
          href="https://www.youtube.com/@jaiparkashmaurya"
          target="_blank"
          rel="noreferrer"
          className="youtube social"
        >
          <FontAwesomeIcon icon={faYoutube} size="2x" />
        </a>
        <a
          href="https://www.facebook.com/jaiparkash077/"
          target="_blank"
          rel="noreferrer"
          className="facebook social"
        >
          <FontAwesomeIcon icon={faFacebook} size="2x" />
        </a>
        <a
          href="https://www.instagram.com/jaiparkash77/"
          target="_blank"
          rel="noreferrer"
          className="instagram social"
        >
          <FontAwesomeIcon icon={faInstagram} size="2x" />
        </a>
        <a href="https://twitter.com/jaiparkash77" rel="noreferrer" target="_blank" className="twitter social">
          <FontAwesomeIcon icon={faTwitter} size="2x" />
        </a>
      </p>
    </>
  )
}
