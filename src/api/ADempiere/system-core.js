import { getLanguage } from '@/lang/index'
import { getToken, getCurrentOrganization, getCurrentWarehouse } from '@/utils/auth'
import BusinessData from '@adempiere/grpc-data-client'
import { BUSINESS_DATA_ADDRESS } from '@/api/ADempiere/constants'

// Get Instance for connection
function Instance() {
  return new BusinessData({
    host: BUSINESS_DATA_ADDRESS,
    sessionUuid: getToken(),
    organizationUuid: getCurrentOrganization(),
    warehouseUuid: getCurrentWarehouse(),
    language: getLanguage() || 'en_US'
  })
}

// Get Organization list from role
export function getOrganizationsList({
  roleUuid,
  roleId,
  pageToken,
  pageSize
}) {
  return Instance.call(this).requestListOrganizations({
    roleUuid,
    roleId,
    pageToken,
    pageSize
  })
}

// Get Warehouses of Organization
export function getWarehousesList({
  organizationUuid,
  organizationId,
  pageToken,
  pageSize
}) {
  return Instance.call(this).requestListWarehouses({
    organizationUuid,
    organizationId,
    pageToken,
    pageSize
  })
}

// Get Country definition from server using id or uuid for record
export function getCountryDefinition({ countryUuid, countryId }) {
  return Instance.call(this).requestGetCountry({
    countryUuid,
    countryId
  })
}

// Get languages from api
export function listLanguages({ pageToken, pageSize }) {
  return Instance.call(this).requestListLanguages({ pageToken, pageSize })
}
