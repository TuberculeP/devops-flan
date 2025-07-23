variable "aws_region" {
  description = "AWS region"
  type        = string
}

variable "app_name" {
  description = "Nom de l'application"
  type        = string
}

variable "container_port" {
  description = "Port exposé par le conteneur"
  type        = number
}

variable "image_url" {
  description = "URL de l'image Docker (ex: ECR)"
  type        = string
}

variable "vpc_id" {
  description = "ID du VPC"
  type        = string
}

variable "public_subnets" {
  description = "Liste des subnets publics"
  type        = list(string)
}
