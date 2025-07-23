output "load_balancer_url" {
  description = "URL du Load Balancer"
  value       = module.ecs_service.lb_dns
}