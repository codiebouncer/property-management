import recentProperties from './RecentProperties.model'
import RecentTenants from './RecentTenants.models'
export default class Dashboard {
  public totalProperties!: number
  public occupiedUnits!: number
  public vacantUnits!: number
  public pendingRepairs!: number
  public recentProperties!: recentProperties[]
  public recentTenants!: RecentTenants[]
}
