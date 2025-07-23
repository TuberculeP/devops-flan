provider "aws" {
  region = var.aws_region
}

module "ecs_service" {
  source         = "./modules/ecs-service"
  app_name       = var.app_name
  aws_region     = var.aws_region
  container_port = var.container_port
  image_url      = var.image_url
  vpc_id         = var.vpc_id
  public_subnets = var.public_subnets
}
