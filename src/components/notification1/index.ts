import { newInstance } from './notification-container'

let seed = 0
const now = Date.now()
let notificationInstance: any = null

function getUuid() {
  return `Notification_${now}_${seed++}`;
}

function getInstance (callback: (i: any) => void) {
  if (notificationInstance) {
    callback(notificationInstance)
  } else {
    newInstance({}, (instance: any) => {
      callback(instance)
      notificationInstance = instance
    })
  }
}

function notice (content, duration) {
  const key = getUuid()
  const notice = { key, content, duration }
  getInstance(instance => {
    instance.notice(notice)
  })
}

const notificationApi: any = {
  open: notice
}

const apiType = ['info', 'success', 'warn', 'error']

apiType.forEach(type => {
  notificationApi[type] = (content: string, duration: number) => {
    return notificationApi.open(content, duration)
  }
})

export default notificationApi