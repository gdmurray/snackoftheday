import * as React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"
import DailySnack from "../components/DailySnack"
import { WindowLocation } from "@reach/router"
import { Provider } from "../components/useLocation"

const IndexPage = ({ location }: { location: WindowLocation }) => {
  return (
    <Provider location={location}>
      <Layout location={location}>
        <SEO title="Home" />
        <DailySnack />
      </Layout>
    </Provider>
  )
}

export default IndexPage
