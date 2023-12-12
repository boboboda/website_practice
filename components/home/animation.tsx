// "use client";

import React, { useState } from 'react';

import Lottie from 'react-lottie-player';
// Alternatively:
// import Lottie from 'react-lottie-player/dist/LottiePlayerLight'

import lottieJson from '../../public/animation_one.json';




export default function Animation() {

  // const [lottie, setLottie] = useState();
  // const getStaticProps = async () => {
  //   const lottieData = await fetch('../../public/animation_one.json');
  //   const lottieJson = await lottieData.json();
  //   return {
  //     props: {
  //       lottie: lottieJson,
  //     },
  //   };
  // };

  return (
    <Lottie
    play
      loop
      animationData={lottieJson}
    />
  )
}