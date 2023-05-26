variable "acr_subscription_id" {
  description = "Azure subscription to use for Timebot resources"
  type        = string
}

variable "resource_group_name" {
  description = "Azure resource group for Timebot"
  default     = "timebot-azure-data"
  type        = string
}

variable "location" {
  description = "Primary deployment region for Azure resources"
  default     = "Central US"
  type        = string
}

variable "environment" {
  description = "Environment for Timebot deployment(nonprod, prod)"
  type        = string
}

variable "instance_tier" {
  description = "Service plan to use for App Serivce"
  default     = "Basic"
  type        = string
}

variable "instance_size" {
  description = "Instance size to use for App Serivce"
  default     = "B1"
  type        = string
}

variable "instance_capacity" {
  description = "Workers associated with App Service Plan"
  default     = "1"
  type        = string
}

variable "timebot_image" {
  description = "Docker image to be used for Timebot service"
  type        = string
}

variable "app_token" {
  description = "App token for Slack app integration"
  type        = string
  sensitive   = true
}

variable "bot_user_token" {
  description = "Bot OAuth token for Slack app integration"
  type        = string
  sensitive   = true
}

variable "harvest_token" {
  description = "Harvest REST API token"
  type        = string
  sensitive   = true
}

variable "harvest_id" {
  description = "Harvest REST API Account Id"
  type        = string
  sensitive   = true
}

variable "timebot_log_level" {
  description = "Logging level to use for Timebot service"
  type        = string
  default     = "info"
}