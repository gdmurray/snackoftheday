import React, { createContext, useReducer } from "react"
import { WindowLocation } from "@reach/router"

interface LocationProviderProps {
  children: React.PropsWithChildren<React.ReactNode>
  location: WindowLocation
}

interface LocationContext {
  location?: WindowLocation;
  state: IState;

  complete(): void;

  getSnack(): void;
}

export const LocationContext = createContext<LocationContext>({
  location: undefined,
  state: { status: "FETCHING" },
  complete: () => {
  },
  getSnack: () => {
  }
})


interface IState {
  status: "FETCHING" | "READY"
}

interface IAction {
  type: "FETCH" | "COMPLETE"
}

function reducer(_state: IState, action: IAction): IState {
  switch (action.type) {
    case "FETCH":
      return { status: "FETCHING" }
    case "COMPLETE":
      return { status: "READY" }
    default:
      throw new Error()
  }
}


export const Provider = (props: LocationProviderProps) => {
  const { location, children } = props

  const [state, dispatch] = useReducer(reducer, {
    status: "FETCHING"
  })

  const complete = () => {
    dispatch({ type: "COMPLETE" })
  }

  const getSnack = () => {
    dispatch({ type: "FETCH" })
  }

  const myContext = {
    location,
    complete,
    getSnack,
    state
  }

  return (
    <LocationContext.Provider value={myContext}>
      {children}
    </LocationContext.Provider>
  )

}