export function documentsRoute(data) {
  return (
    {
      type: 'push',
      route: {
        key: data.key,
        title: 'documents',
        data: data
      }
    }
  )
}

export const loginRoute = {
  type: 'push',
  route: {
    key: 'login',
    title: 'login'
  }
}

export const forgotPasswordRoute = {
  type: 'push',
  route: {
    key: 'forgotPassword',
    title: 'forgotPassword',
    userName: ''
  }
}

export function documentRoute(data) {
  return (
    {
      type: 'push',
      route: {
        key: "document",
        data:data
      }
    }

  );

 
}

