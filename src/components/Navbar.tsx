import React, { useContext } from "react"
import { BiShuffle } from "@react-icons/all-files/bi/BiShuffle"
import tw from "twin.macro"
import styled from "@emotion/styled"
import { Link, navigate } from "gatsby"
import { LocationContext } from "./useLocation"
import { WindowLocation } from "@reach/router"
import { motion } from "framer-motion"

const RandomButton = styled(motion.button)`
  ${tw`flex flex-row relative
  items-center justify-between
  px-4 py-2 mx-auto
  text-gray-50 font-medium 
  border border-white rounded-2xl
  transition-all duration-150 ease-in-out
  outline-none focus:outline-none
  hover:(bg-white shadow-lg text-indigo-800)
  `}
  &:hover {
    text-shadow: 0.25px 0px 0.1px #3730A3;
  }
`

//active:(bg-blueGray-200 border-indigo-600 shadow-2xl)
const Logo = tw(Link)`
  leading-normal font-bold tracking-tight text-lg text-white
`

const RandomSnack = () => {
  const context = useContext(LocationContext)
  const { location, getSnack } = context

  const handleRandomize = () => {
    const { pathname } = location as WindowLocation
    if (pathname === "/random") {
      getSnack()
    } else {
      navigate("/random")
    }
  }

  return (
    <RandomButton
      onClick={handleRandomize}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.9 }}>
      <span>Random</span> <BiShuffle className="ml-2" />
    </RandomButton>
  )
}

const NavigationBar = tw.div`
  px-5 py-4
  bg-indigo-600
  dark:bg-coolGray-900
  shadow-md
`

function Navbar() {
  return (
    <NavigationBar>
      <nav className="flex items-center justify-between">
        <Logo to={"/"}>
          Snack Of The Day
        </Logo>
        <div>
          <RandomSnack />
        </div>
      </nav>
    </NavigationBar>

  )
}

export default Navbar