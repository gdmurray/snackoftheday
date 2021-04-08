import React, { useContext, useEffect, useState } from "react"
import { fetchSnacks, getRandomInt, Snack } from "./common"
import SnackDisplay from "./SnackDisplay"
import { LocationContext } from "./useLocation"
import LoadingBurger from "./LoadingBurger"


const RandomSnack = () => {
  const [snack, setSnack] = useState<Snack>()
  const [loading, setLoading] = useState<boolean>(true)
  const context = useContext(LocationContext)
  const { state, complete } = context


  useEffect(() => {
    const { status } = state
    if (status === "FETCHING") {
      setLoading(true)
      fetchSnacks().then(snacks => {
        const randomSnack = getRandomInt(0, snacks.length)
        setSnack(snacks[randomSnack])
        complete()
      })
    }

    const snackTimeout = window.setTimeout(() => {
      console.log("SNACK TIMEOUT!")
      setLoading(false)
    }, getRandomInt(400, 1000))
    return () => window.clearTimeout(snackTimeout)

  }, [state.status])


  if (snack && !loading) {
    return (
      <div>
        <SnackDisplay snack={snack} />
      </div>
    )
  }

  return (
    <LoadingBurger text="Loading Your Random Snack" />
  )
}

export default RandomSnack