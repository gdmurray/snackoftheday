/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import * as React from "react"
import PropTypes from "prop-types"
import "./layout.css"
import Navbar from "./Navbar"
import tw from "twin.macro"

const LayoutWrapper = tw.div`
  flex flex-col min-h-screen 
  dark:bg-coolGray-800 
  bg-gray-200
  font-sans
`
const Layout = ({ children }: React.PropsWithChildren<React.ReactNode>) => {
  return (
    <LayoutWrapper>
      <Navbar />
      <div
        className="flex-1 flex justify-center align-middle"
      >
        {children}
      </div>
    </LayoutWrapper>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired
}

export default Layout