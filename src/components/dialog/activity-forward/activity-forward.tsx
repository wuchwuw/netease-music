import React, { useState } from 'react'
import Dialog from 'COMPONENTS/dialog/dialog'
import './activity-forward.less'
import { UseDialogProps } from '..'
import Button from 'COMPONENTS/button/button'
import Icon from 'COMPONENTS/icon/icon'
import api from 'API/index'
import { useSelector } from 'react-redux'
import { RootState } from 'STORE/index'
import notificationApi from 'COMPONENTS/notification'

interface ActicityForwardDialogProps {
  evId: number
}

const ActicityForwardDialog: React.SFC<UseDialogProps & ActicityForwardDialogProps> = (props) => {
  const [forwards, setForwards] = useState('')
  const user = useSelector((state: RootState) => state.user.user)

  async function forward () {
    try {
      const res = await api.forward({
        forwards,
        uid: user.userId,
        evId: props.evId
      })
      props.close()
      notificationApi.success({
        content: '转发成功'
      })
    } catch (e) {}
  }

  return (
    <Dialog {...props} width={470}>
      <div styleName="activity-forward">
        <div styleName="activity-dialog-textarea-wrap">
          <textarea
            value={forwards}
            onChange={(e) => { setForwards(e.target.value) }}
            styleName="activity-dialog-textarea"
            placeholder="说点什么吧~"
            rows={8}
          >
          </textarea>
          <div styleName="activity-dialog-textarea-option">
            <Icon name="icon-face" fontSize={18}></Icon>
            <Icon name="icon-aite" fontSize={18}></Icon>
            <Icon name="icon-addtag" fontSize={18}></Icon>
            <span styleName="activity-dialog-textarea-reset">140</span>
          </div>
        </div>
        <div styleName="activity-dialog-button-wrap">
          <Button onClick={() => { forward() }} type="primary">转发</Button>
        </div>
      </div>
    </Dialog>
  )
}

export default ActicityForwardDialog