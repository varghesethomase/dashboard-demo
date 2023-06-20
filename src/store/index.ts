import {atom} from "recoil"
import {DASHBOARD_CREATOR_COORDINATES, GRID_GAP} from "../configs"

export const dashboardCanvasHeight = atom({
  key: "CanvasHeight",
  default: DASHBOARD_CREATOR_COORDINATES.height,
})

export const gridSize = atom({
  key: "GridSize",
  default: GRID_GAP,
})
