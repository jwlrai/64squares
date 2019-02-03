

export function showAlert (content,type) {
  return {
    type: 'SHOW_ALERT',
    alert: {
      display:"block",
      type:type||'danger',
      content: content
    }
  }
}

export function hideAlert(){
  return {
    type: 'HIDE_ALERT',
    alert: {
      display:"none",
      content: ''
    }
  }
}