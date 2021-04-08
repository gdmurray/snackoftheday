import React, { useEffect, useState } from "react"
import tw from "twin.macro"
import { Snack } from "./common"
import unescape from "lodash.unescape"
import { useAnimation } from "framer-motion"
import { motion } from "framer-motion"

const SnackWrapper = tw.div`
  mt-16
`

const SnackTitle = tw.div`
  font-semibold
  dark:text-coolGray-200 text-warmGray-700 
  tracking-tight 
  text-center text-xl
  mx-auto
`

export default function SnackDisplay({ snack }: { snack: Snack }) {
  const { name, id } = snack
  const controls = useAnimation()
  const [loaded, setLoaded] = useState<boolean>(false)

  const sequence = async () => {
    if (loaded) {
      console.log("Loaded")
      controls.start({
        scale: [0.25, 1],
        transition: {
          duration: .25
        }
      })
      controls.start({
        rotate: [0, 1, -1, 1, -1, 1, 0, 0, 0],
        transition: {
          delay: 2,
          repeat: Infinity,
          duration: 4
        }
      })
    }
  }

  useEffect(() => {
    sequence()
  }, [snack, loaded])


  return (
    <SnackWrapper>
      <motion.img
        className="mx-auto"
        style={{
          maxHeight: "50vh"
        }}
        alt="name"
        src={`/${id}.png`}
        animate={controls}
        onLoad={() => setLoaded(true)}


      />
      <SnackTitle style={{ width: "60%", maxWidth: "600px" }}>
        {unescape(name)}
      </SnackTitle>
    </SnackWrapper>
  )
}

