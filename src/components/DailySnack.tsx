import React, { useEffect, useState } from "react"
import dayjs from "dayjs"

const localizedFormat = require("dayjs/plugin/localizedFormat")
dayjs.extend(localizedFormat)

import { fetchSnacks, getRandomInt, Snack } from "./common"
import LoadingBurger from "./LoadingBurger"
import SnackDisplay from "./SnackDisplay"

const DailySnack = () => {
  const [snack, setSnack] = useState<Snack>()
  const [loading, setLoading] = useState<boolean>(true)

  const currentDate = new Date()
  const dateNumber: number = parseInt(dayjs(currentDate).format("DDMMYYYY"))

  useEffect(() => {
    const dailySnackTimeout = window.setTimeout(() => {
      setLoading(false)
    }, getRandomInt(600, 2500))
    return () => window.clearTimeout(dailySnackTimeout)
  }, [])

  useEffect(() => {
    fetchSnacks().then(snacks => {
      const snackIndex = dateNumber % (snacks.length + 1)
      setSnack(snacks[snackIndex])
    })
  }, [])

  if (snack && !loading) {
    return (
      <div>
        <div className="mt-16 mb-2 text-center text-md font-medium text-warmGray-700 dark:text-coolGray-400">
          {dayjs(currentDate).format("LL")}
        </div>
        <div
          className="text-center tracking-tight text-3xl font-bold text-warmGray-700 dark:text-coolGray-100">
          Today's Snack is
        </div>
        <SnackDisplay snack={snack} />
      </div>
    )
  }

  return (
    <LoadingBurger text="Loading Your Daily Snack" />
  )
}

export default DailySnack