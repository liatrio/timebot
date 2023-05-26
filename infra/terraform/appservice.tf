resource "azurerm_app_service_plan" "timebot_app_service_plan" {
  name                = "timebot-${var.environment}-service-plan"
  location            = var.location
  resource_group_name = var.resource_group_name
  kind                = "Linux"
  reserved            = true

  sku {
    tier     = var.instance_tier
    size     = var.instance_size
    capacity = var.instance_capacity
  }
}

resource "azurerm_app_service" "timebot_app_service" {
  name                    = "timebot-${var.environment}-service"
  location                = var.location
  resource_group_name     = var.resource_group_name
  app_service_plan_id     = azurerm_app_service_plan.timebot_app_service_plan.id
  https_only              = true
  client_affinity_enabled = true

  site_config {
    always_on         = "true"
    linux_fx_version  = "DOCKER|${var.timebot_image}"
    health_check_path = "/health"
  }

  identity {
    type = "SystemAssigned"
  }

  app_settings = {
    "APP_TOKEN"                   = "@Microsoft.KeyVault(SecretUri=${azurerm_key_vault_secret.app_token.id})"
    "BOT_USER_OAUTH_ACCESS_TOKEN" = "@Microsoft.KeyVault(SecretUri=${azurerm_key_vault_secret.bot_user_token.id})"
	  "HARVEST_TOKEN"               = "@Microsoft.KeyVault(SecretUri=${azurerm_key_vault_secret.harvest_token.id})"
	  "HARVEST_ID"                  = "@Microsoft.KeyVault(SecretUri=${azurerm_key_vault_secret.harvest_id.id})"
    "LOG_LEVEL"                   = var.timebot_log_level
  }
}