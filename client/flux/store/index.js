import { EventEmitter2 } from 'eventemitter2'
import assign from 'object-assign'
import Dispatcher from '../dispatcher'
import Actions from './../actions'
import EventsConstants from '../constants/EventsConstants'
import DeviceConstants from '../constants/DeviceConstants'


const Store = assign({}, EventEmitter2.prototype, {

  Size: { w: window.innerWidth, h: window.innerHeight },
  Mouse: { x: 0, y: 0, nX: 0, nY: 0 },
  Device:  { orientation: DeviceConstants.PORTRAIT },
  Resources: {},
  getResource: ( id ) => Store.Resources[ id ],
  Routes: { oldRoute: undefined, newRoute: undefined }

})

Store.dispatchToken = Dispatcher.register(( payload ) => {

  const actionType = payload.type
  const item = payload.item

  switch ( actionType ) {
    case EventsConstants.WINDOW_RESIZE:
      Store.Device.orientation = ( item.windowW > item.windowH ) ? DeviceConstants.LANDSCAPE : DeviceConstants.PORTRAIT
      Store.Size.w =  item.windowW
      Store.Size.h =  item.windowH
      Store.emit( actionType, item )
      break
    case EventsConstants.MOUSE_MOVE:
      Store.Mouse = item
      Store.emit( actionType, item )
      break
    case EventsConstants.RESOURCES_READY:
      Store.Resources = item
      Store.emit( actionType, item )
      break
    case EventsConstants.ROUTE_CHANGED:
      Store.Routes.oldRoute = item.oldRoute
      Store.Routes.newRoute = item.newRoute
      Store.emit( actionType, item )
      break
    case EventsConstants.CHANGE_PAGE:
      if( Store.Routes.newRoute === item ) break
      setTimeout( () => Actions.transitionOut( item ) )
      Store.emit( actionType, item )
      break
    default:
      Store.emit( actionType, item )
      break
  }

})

export default Store