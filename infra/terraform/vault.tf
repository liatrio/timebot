data "azurerm_client_config" "current" {}

resource "azurerm_key_vault" "timebot" {
  name                       = "timebot-${var.environment}"
  location                   = var.location
  resource_group_name        = var.resource_group_name
  tenant_id                  = data.azurerm_client_config.current.tenant_id
  sku_name                   = "standard"
  soft_delete_retention_days = 7
}

resource "azurerm_key_vault_access_policy" "timebot_access" {
  key_vault_id = azurerm_key_vault.timebot.id

  tenant_id = azurerm_app_service.timebot_app_service.identity.0.tenant_id
  object_id = azurerm_app_service.timebot_app_service.identity.0.principal_id

  secret_permissions = [
    "Get",
  ]
}

resource "azurerm_key_vault_access_policy" "terraform_access" {
  key_vault_id = azurerm_key_vault.timebot.id

  tenant_id = data.azurerm_client_config.current.tenant_id
  object_id = data.azurerm_client_config.current.object_id

  secret_permissions = [
    "Set",
    "Get",
    "Delete",
    "Purge",
    "Recover"
  ]
}

resource "azurerm_key_vault_secret" "app_token" {
  name         = "app-token"
  value        = var.app_token
  key_vault_id = azurerm_key_vault.timebot.id

  depends_on = [
    azurerm_key_vault_access_policy.terraform_access
  ]
}

resource "azurerm_key_vault_secret" "bot_user_token" {
  name         = "bot-user-token"
  value        = var.bot_user_token
  key_vault_id = azurerm_key_vault.timebot.id

  depends_on = [
    azurerm_key_vault_access_policy.terraform_access
  ]
}

resource "azurerm_key_vault_secret" "harvest_token" {
  name         = "harvest-token"
  value        = var.harvest_token
  key_vault_id = azurerm_key_vault.timebot.id

  depends_on = [
    azurerm_key_vault_access_policy.terraform_access
  ]
}

resource "azurerm_key_vault_secret" "harvest_id" {
  name         = "harvest-id"
  value        = var.harvest_id
  key_vault_id = azurerm_key_vault.timebot.id

  depends_on = [
    azurerm_key_vault_access_policy.terraform_access
  ]
}