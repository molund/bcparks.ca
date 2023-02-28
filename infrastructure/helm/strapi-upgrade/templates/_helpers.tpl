{{/*
Expand the name of the chart.
*/}}
{{- define "bcparks.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "bcparks.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "bcparks.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "bcparks.labels" -}}
helm.sh/chart: {{ include "bcparks.chart" . }}
{{ include "bcparks.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "bcparks.selectorLabels" -}}
app.kubernetes.io/name: {{ include "bcparks.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Create the name of the service account to use
*/}}
{{- define "bcparks.serviceAccountName" -}}
{{- if .Values.serviceAccount.create }}
{{- default (include "bcparks.fullname" .) .Values.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.serviceAccount.name }}
{{- end }}
{{- end }}

{{/*
Gets the suffix of the namespace. (-dev, -tools, ... )
*/}}
{{- define "bcparks.namespaceSuffix" }}
{{- (split "-" .Release.Namespace)._1 | trim -}}
{{- end }}

{{ define "bcparks_cms_volume_claim" -}}
bcparks-cms
{{- end -}}

{{ define "bcparks_cms_secret" -}}
bcparks-cms-secret
{{- end -}}

{{ define "bcparks_cms_external_url" -}}
https://{{ .Release.Name }}-{{ .Values.cmsUpgrade.componentName }}-{{ .Release.Namespace }}.{{ .Values.cluster.domain }}
{{- end -}}

{{ define "bcparks_patroni_fullname" -}}
bcparks-{{ .Values.patroni.componentName }}
{{- end -}}

{{ define "bcparks_patroni_secret" -}}
bcparks-{{ .Values.patroni.componentName }}-secret
{{- end -}}

{{ define "bcparks_postgres_backup_fullname" -}}
bcparks-{{ .Values.backup.componentName }}
{{- end -}}

{{ define "bcparks_pgbouncer_fullname" -}}
bcparks-{{ .Values.pgbouncer.componentName }}
{{- end -}}

{{ define "bcparks_admin_external_url" -}}
https://{{ .Release.Name }}-{{ .Values.admin.componentName }}-{{ .Release.Namespace }}.{{ .Values.cluster.domain }}
{{- end -}}

{{ define "bcparks_public_external_url" -}}
https://{{ .Release.Name }}-{{ .Values.public.componentName }}-{{ .Release.Namespace }}.{{ .Values.cluster.domain }}
{{- end -}}