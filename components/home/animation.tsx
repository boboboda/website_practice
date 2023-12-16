// "use client";

import React, { useState } from 'react';

import Lottie from 'react-lottie-player';
// Alternatively:
// import Lottie from 'react-lottie-player/dist/LottiePlayerLight'

import lottieJson from '../../public/main animation.json';




export default function Animation() {
  return (
    <Lottie
    play
      loop
      animationData={lottieJson}
    />
  )
}