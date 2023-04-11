
//RefreshTokens
export type refreshTokensDataModel = {
    value: string,
    userId: string,
    deviceId: string,
    deviceName: string,
    IP: string,
    createdAt: Date,
    expiredAt: Date
}

export type  RefreshTokensTypeSchema = Array<{
    ip: string,
    title: string,
    lastActiveDate: Date,
    deviceId: string,
}>

export type  RefreshTokensDataTypeSchema = Array<{
    IP: string,
    deviceName: string,
    deviceId: string,
    createdAt: Date,
}>