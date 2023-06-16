data "azurerm_key_vault" "timebot" {
  name                = var.key_vault_name
  resource_group_name = var.resource_group_name
}

resource "azurerm_role_assignment" "timebot" {
  scope                = data.azurerm_key_vault.timebot.id
  role_definition_name = "Key Vault Secrets User"
  principal_id         = azurerm_app_service.timebot_app_service.identity.0.principal_id
}

resource "azurerm_key_vault_secret" "app_token" {
  name         = "app-token"
  value        = var.app_token
  key_vault_id = data.azurerm_key_vault.timebot.id
}

resource "azurerm_key_vault_secret" "bot_user_token" {
  name         = "bot-user-token"
  value        = var.bot_user_token
  key_vault_id = data.azurerm_key_vault.timebot.id
}

resource "azurerm_key_vault_secret" "harvest_token" {
  name         = "harvest-token"
  value        = var.harvest_token
  key_vault_id = data.azurerm_key_vault.timebot.id
}

resource "azurerm_key_vault_secret" "harvest_id" {
  name         = "harvest-id"
  value        = var.harvest_id
  key_vault_id = data.azurerm_key_vault.timebot.id
}