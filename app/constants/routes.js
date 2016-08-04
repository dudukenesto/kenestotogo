export const documentsRoute = {
  type: 'push',
  route: {
    key: 'documents',
    title: 'documents'
  }
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
        key: 'document',
        data:data
      }
    }

  );

 
}

