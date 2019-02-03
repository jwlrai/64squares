

export function showModel (conetent) {
    return {
      type: 'SHOW_MODEL',
      content: {
        show:true,
        content: conetent
      }
    }
  }
  
  export function hideModel(e){
   
    
      return {
        type: 'HIDE_MODEL',
        content: {
          show:false,
          content: ''
        }
      }
    
    
  }