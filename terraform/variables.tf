variable "region" {
  default = "ap-south-1"
}

variable "cluster_name" {
  default = "cloudpulse-cluster"
}

variable "node_instance_type" {
  default = "t3.medium"
}

variable "desired_size" {
  default = 2
}

variable "max_size" {
  default = 3
}

variable "min_size" {
  default = 1
}
