
import React, { useState } from 'react';
import { Card, CardMedia, Dialog, DialogContent, CircularProgress } from '@mui/material';

const ExpandableImageHolder = ({ imageUrl, altText, className }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Card
        className={className}
        style={{
          width: '550px',
          height: '550px',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
          position: 'relative',
          backgroundColor: loading ? '#1e293b' : 'transparent', // Dark background while loading
        }}
        onClick={handleOpen}
      >
        {loading && (
          <div style={{ 
            position: 'absolute', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            width: '100%', 
            height: '100%' 
          }}>
            <CircularProgress style={{ color: '#82cded' }} />
          </div>
        )}


        <CardMedia
          component="img"
          image={imageUrl}
          alt={altText}
          style={{
            width: '100%',
            maxWidth: '550px',
            height: 'auto',
            maxHeight: '550px',
            objectFit: 'contain',
            display: loading ? 'none' : 'block', // Hide image until loaded
            margin: '0 auto',
          }}
          onLoad={() => setLoading(false)} // Hide spinner when image loads
        />
      </Card>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogContent style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#0a192f' }}>
          <img
            src={imageUrl}
            alt={altText}
            style={{
              width: '100%',
              height: 'auto',
              maxHeight: '90vh',
              objectFit: 'contain',
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ExpandableImageHolder;

/*
import React, { useState, useEffect } from 'react';
import { Card, CardMedia, Dialog, DialogContent, CircularProgress, Typography } from '@mui/material';

const ExpandableImageHolder = ({ imageUrl, altText, className }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [contentLoaded, setContentLoaded] = useState(false); // ✅ Track content loading

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // ✅ Simulate content loading delay
  useEffect(() => {
    setTimeout(() => setContentLoaded(true), 1500); // Adjust time as needed
  }, []);

  return (
    <>
      <Card
        className={className}
        style={{
width: '550px',
          height: 'auto',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
          position: 'relative',
          backgroundColor: loading ? '#1e293b' : 'transparent', // Dark background while loading
        }}
        onClick={handleOpen}
      >
  
        {(loading || !contentLoaded) && (
          <div className="image-loading-container">
            <CircularProgress className="custom-loader" />
            <Typography className="loading-text">Loading content...</Typography>
          </div>
        )}

        <CardMedia
          component="img"
          image={imageUrl}
          alt={altText}
          className={`accordion-image ${loading ? 'hidden' : 'visible'}`}
          onLoad={() => setLoading(false)}
        />
      </Card>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogContent className="dialog-content">
          {!contentLoaded ? (
            <div className="image-loading-container">
              <CircularProgress className="custom-loader" />
              <Typography className="loading-text">Loading content...</Typography>
            </div>
          ) : (
            <img
              src={imageUrl}
              alt={altText}
              className="expanded-image"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ExpandableImageHolder;
*/