#!/usr/bin/env bash
kubectl delete -f test.yaml
kubectl create -f test.yaml
watch kubectl get pods