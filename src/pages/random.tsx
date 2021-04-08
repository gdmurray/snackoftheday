import * as React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"
import RandomSnack from "../components/RandomSnack"
import { WindowLocation } from "@reach/router"
import { Provider } from "../components/useLocation"

const Random = ({ location }: { location: WindowLocation }) => {
  return (
    <Provider location={location}>
      <Layout>
        <SEO title="Home" />
        <RandomSnack />
      </Layout>
    </Provider>

  )
}

export default Random
