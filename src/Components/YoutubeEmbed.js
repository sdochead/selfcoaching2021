import React from "react";
import PropTypes from "prop-types";
import "./Styles.css";

const YoutubeEmbed = ({ embedId }) => (
  <div width="100%">
    <iframe
      width="100%"
      //height="200"
      src={`https://www.youtube.com/embed/${embedId}`}
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      title="Embedded youtube"
    />
  </div>
);

YoutubeEmbed.propTypes = {
  embedId: PropTypes.string.isRequired
};

export default YoutubeEmbed;