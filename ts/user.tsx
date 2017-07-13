export interface User {
  name: string | string[] | undefined
  email: string | string[] | undefined
  address: string | string[] | undefined
  zip: string | string[] | undefined
}

export var blankUser:User = {
  name: "",
  email: "",
  address: "",
  zip: ""
};