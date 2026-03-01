# Documento de Especificaciones Técnicas y Arquitectónicas
## Sistema de Gestión de Presupuesto de Gastos

---

| Campo | Detalle |
|---|---|
| Proyecto | Sistema de Presupuesto de Gastos – Empresa Renata |
| Versión del Documento | 1.0.0 |
| Fecha de Emisión | Febrero 2026 |
| Estado | En revisión |
| Clasificación | Confidencial |
| Autor | Equipo de Arquitectura de Software |

---

## 1. Introducción y Propósito del Documento

Este documento describe las especificaciones técnicas y arquitectónicas del Sistema de Gestión de Presupuesto de Gastos desarrollado para la empresa Renata. El sistema está orientado al control financiero semanal del personal, la administración de publicidad digital, el seguimiento de gastos operativos y el cálculo de métricas de rentabilidad en tiempo real.

El documento es de uso interno y sirve como referencia para el equipo de desarrollo, arquitectos de solución, QA y stakeholders técnicos. Debe ser revisado y actualizado con cada iteración relevante del sistema.

### 1.1 Alcance del Sistema

El sistema cubre los siguientes módulos funcionales, identificados a partir del análisis de la planilla de presupuesto:

- Gestión de nómina semanal con cálculo automático de sueldos por hora trabajada y viáticos
- Registro y conversión de gastos de publicidad digital (Facebook Ads) con tipo de cambio configurable
- Control de gastos operativos fijos: supermercado, luz, expensas, impuestos, internet, contador, gas, mantenimientos
- Cálculo de ingresos brutos y netos con conversión de moneda
- Dashboard de visualización con gráficos de distribución de gastos (donut chart)
- Gestión de proveedores con estados especiales (ej. Payway bonificado)

### 1.2 Objetivos Técnicos

- Proveer una plataforma web responsive y de alta disponibilidad
- Garantizar la integridad y consistencia de los datos financieros
- Permitir auditoría completa de cambios con registro de histórico
- Soportar múltiples divisas con actualización automática del tipo de cambio
- Ofrecer reportes exportables en PDF y Excel

---

## 2. Arquitectura del Sistema

### 2.1 Patrón Arquitectónico

El sistema adopta una arquitectura de tres capas (3-Tier Architecture) con separación clara entre presentación, lógica de negocio y persistencia de datos, desplegada en la nube con enfoque en microservicios para los módulos críticos.

| Capa | Responsabilidad | Tecnología Principal |
|---|---|---|
| Presentación (Frontend) | Interfaz de usuario, visualizaciones, formularios | React 18 + TypeScript |
| Lógica de Negocio (Backend) | APIs REST, reglas de negocio, cálculos financieros | Node.js + Express / NestJS |
| Persistencia (Base de Datos) | Almacenamiento transaccional y analítico | PostgreSQL + Redis |

### 2.2 Diagrama de Componentes

| Componente | Tipo | Descripción |
|---|---|---|
| budget-ui | Frontend App | SPA React que consume las APIs del backend y renderiza dashboards financieros |
| budget-api-gateway | API Gateway | Punto de entrada único para todas las solicitudes del frontend, gestiona autenticación y rate limiting |
| salary-service | Microservicio | Calcula sueldos semanales: horas × precio/hora + viáticos por día trabajado |
| expense-service | Microservicio | CRUD de gastos operativos con categorización y validación de límites presupuestarios |
| ads-service | Microservicio | Integra con Meta Ads API para obtener gasto real y gestiona conversión de divisa |
| fx-service | Microservicio | Obtiene tipo de cambio en tiempo real desde proveedores externos (Fixer.io / BCRA) |
| report-service | Microservicio | Genera reportes PDF/Excel y calcula indicadores de rentabilidad neta |
| notification-service | Microservicio | Envía alertas por email/WhatsApp cuando los gastos superan umbrales configurados |
| PostgreSQL | Base de Datos | Almacenamiento principal transaccional de presupuestos, empleados y gastos |
| Redis | Cache | Caché de tipos de cambio, sesiones y resultados de cálculos frecuentes |

### 2.3 Stack Tecnológico Detallado

| Categoría | Tecnología | Versión | Justificación |
|---|---|---|---|
| Frontend Framework | React | 18.x | Ecosistema maduro, soporte de hooks y SSR con Next.js |
| Lenguaje Frontend | TypeScript | 5.x | Tipado estático reduce errores en cálculos financieros |
| Estilos | Tailwind CSS | 3.x | Desarrollo rápido de UI consistente |
| Gráficos | Recharts / Chart.js | 2.x | Donut charts, barras y líneas de tiempo financieros |
| Backend Runtime | Node.js | 20 LTS | Alto rendimiento para APIs y cálculos en tiempo real |
| Framework Backend | NestJS | 10.x | Arquitectura modular, inyección de dependencias, decoradores |
| ORM | Prisma | 5.x | Type-safe queries, migraciones automatizadas |
| Base de Datos | PostgreSQL | 16.x | ACID compliance, soporte JSON, particionado por fecha |
| Cache / Sesiones | Redis | 7.x | TTL configurable para tipos de cambio y sesiones |
| Autenticación | JWT + OAuth2 | RFC 7519 | Tokens seguros, integración con SSO corporativo |
| Contenerización | Docker + Compose | 24.x | Ambiente reproducible para desarrollo y staging |
| Orquestación | Kubernetes | 1.29 | Auto-scaling y alta disponibilidad en producción |
| CI/CD | GitHub Actions | v4 | Pipelines automatizados de build, test y deploy |
| Monitoreo | Grafana + Prometheus | 10.x / 2.x | Métricas de performance y alertas operativas |
| Logging | Winston + ELK Stack | 3.x | Centralización y búsqueda de logs |
| Testing | Jest + Cypress | 29.x / 13.x | Unit tests backend + E2E frontend |

---

## 3. Especificaciones Funcionales por Módulo

### 3.1 Módulo de Nómina Semanal

Este módulo gestiona el cálculo de remuneraciones del personal. Basado en la planilla analizada, el sistema implementa la siguiente fórmula de cálculo:

```
Sueldo Semanal = (Horas Trabajadas × Precio por Hora) + (Días Trabajados × Viático)
```

> **Ejemplo real del sistema:** Empleado Renata — 38 horas × $3,000 + 6 días × $2,700 = **$130,200**

| Endpoint | Método | Descripción |
|---|---|---|
| POST /api/v1/salary/calculate | POST | Calcula sueldo de un empleado dado horas, precio/hora y días |
| GET /api/v1/salary/weekly/{employeeId} | GET | Retorna el desglose semanal por semana (S1–S4) |
| PUT /api/v1/salary/{id} | PUT | Actualiza parámetros salariales |
| GET /api/v1/salary/total | GET | Suma total de sueldos del período (ej. $445,800) |

### 3.2 Módulo de Publicidad Digital

Gestiona los gastos de publicidad en plataformas digitales con soporte multi-divisa. El sistema recibe el gasto en dólares (USD) y aplica el tipo de cambio configurado para calcular el equivalente en pesos.

| Campo | Tipo | Validación | Ejemplo |
|---|---|---|---|
| monto_usd | DECIMAL(10,2) | Mayor que 0 | 1,028.97 |
| tipo_cambio | DECIMAL(8,2) | Actualizado automáticamente | 1,500 |
| monto_local | DECIMAL(12,2) | Calculado (monto_usd × tipo_cambio) | 2,000,000 |
| plataforma | ENUM | facebook \| google \| tiktok \| other | facebook |
| fecha | DATE | No futura | 2026-02-28 |
| estado | ENUM | activo \| pausado \| bonificado | activo |

### 3.3 Módulo de Gastos Operativos

Centraliza el registro de todos los gastos fijos y variables del negocio. Las categorías identificadas en el sistema actual son:

| Categoría | Monto Referencia | Tipo | Frecuencia |
|---|---|---|---|
| Supermercado | $450,000 | Variable | Mensual |
| Luz | $435,000 | Variable | Mensual |
| Expensas | $110,000 | Fijo | Mensual |
| Impuestos | $180,000 | Fijo | Mensual |
| Mantenimientos | $160,000 | Variable | Mensual |
| Internet | $83,000 | Fijo | Mensual |
| Contador | $91,000 | Fijo | Mensual |
| Gas | $25,000 | Variable | Mensual |
| Payway | Bonificado | Especial | Mensual |
| Sueldos | $445,800 | Variable | Semanal |
| Publicidad | $2,000,000 | Variable | Mensual |

### 3.4 Módulo de Ingresos y Rentabilidad

Calcula los indicadores clave de rendimiento financiero del negocio. Implementa la siguiente cadena de cálculo:

| Indicador | Fórmula | Ejemplo |
|---|---|---|
| Ingresos Brutos (ARS) | Suma de ventas del período | $3,244,000 |
| Tipo de Cambio | Fuente externa (BCRA / Fixer.io) | $1,510 |
| Ingresos en USD | Ingresos ARS / Tipo de Cambio | $2,148.34 |
| Costo de Mercadería | Suma de compras y gastos directos | $2,432,500 |
| Neto | Ingresos Brutos − Costo de Mercadería | $811,500 |
| Margen Neto % | (Neto / Ingresos) × 100 | 25.01% |

---

## 4. Modelo de Datos

### 4.1 Entidades Principales

| Entidad | Tabla | Descripción |
|---|---|---|
| Empleado | employees | Datos del personal: nombre, precio/hora, viático diario |
| Semana Laboral | work_weeks | Horas y días trabajados por empleado por semana |
| Gasto Operativo | operational_expenses | Gastos categorizados con montos y fechas |
| Campaña Publicitaria | ad_campaigns | Gastos de publicidad digital multi-plataforma |
| Tipo de Cambio | fx_rates | Historial de tipos de cambio por divisa y fecha |
| Período Presupuestario | budget_periods | Agrupación mensual/semanal de presupuestos |
| Ingreso | revenues | Registro de ventas e ingresos del período |
| Costo Mercadería | cost_of_goods | Costos directos asociados a la producción o compra |
| Reporte | reports | Metadatos de reportes generados (PDF/Excel) |
| Auditoría | audit_log | Historial de cambios con usuario, timestamp y valor anterior |

### 4.2 Esquema de Base de Datos — Tablas Críticas

#### Tabla: `employees`

```sql
CREATE TABLE employees (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          VARCHAR(200) NOT NULL,
  hourly_rate   DECIMAL(10,2) NOT NULL CHECK (hourly_rate > 0),
  daily_viatico DECIMAL(10,2) NOT NULL DEFAULT 0,
  active        BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);
```

#### Tabla: `work_weeks`

```sql
CREATE TABLE work_weeks (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id  UUID REFERENCES employees(id),
  week_number  SMALLINT NOT NULL CHECK (week_number BETWEEN 1 AND 5),
  period_id    UUID REFERENCES budget_periods(id),
  hours_worked DECIMAL(5,2) NOT NULL CHECK (hours_worked >= 0),
  days_worked  SMALLINT NOT NULL CHECK (days_worked BETWEEN 0 AND 7),
  salary_total DECIMAL(12,2) GENERATED ALWAYS AS
               (hours_worked * (SELECT hourly_rate FROM employees WHERE id = employee_id)
               + days_worked * (SELECT daily_viatico FROM employees WHERE id = employee_id)) STORED,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);
```

#### Tabla: `operational_expenses`

```sql
CREATE TABLE operational_expenses (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  period_id  UUID REFERENCES budget_periods(id),
  category   VARCHAR(100) NOT NULL,
  amount     DECIMAL(14,2) NOT NULL,
  currency   CHAR(3) NOT NULL DEFAULT 'ARS',
  status     VARCHAR(20) DEFAULT 'active'
               CHECK (status IN ('active', 'bonificado', 'pausado')),
  notes      TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Tabla: `fx_rates`

```sql
CREATE TABLE fx_rates (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_ccy   CHAR(3) NOT NULL,
  to_ccy     CHAR(3) NOT NULL,
  rate       DECIMAL(12,4) NOT NULL CHECK (rate > 0),
  source     VARCHAR(50),
  valid_at   TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_fx_rates_lookup ON fx_rates (from_ccy, to_ccy, valid_at DESC);
```

---

## 5. Especificaciones de Seguridad

### 5.1 Autenticación y Autorización

| Mecanismo | Implementación | Detalle |
|---|---|---|
| Autenticación | JWT (RS256) | Tokens firmados con clave privada RSA-256, TTL 15 min |
| Refresh Tokens | Almacenados en Redis | TTL 7 días, rotación automática en cada uso |
| Autorización | RBAC (Role-Based) | Roles: admin, contador, viewer, operador |
| 2FA | TOTP (Google Authenticator) | Obligatorio para roles admin y contador |
| Sesiones | Redis con TTL | Invalidación inmediata en logout |
| Contraseñas | bcrypt | Salt rounds: 12, mínimo 12 caracteres con complejidad |
| HTTPS | TLS 1.3 | Certificados Let's Encrypt con renovación automática |
| CORS | Lista blanca de orígenes | Solo dominios corporativos autorizados |

### 5.2 Protección de Datos Financieros

- Encriptación AES-256-GCM para datos sensibles en reposo (montos, salarios, ingresos)
- Enmascaramiento de datos en logs: montos y nombres de empleados nunca se loguean en claro
- Backup cifrado automático cada 6 horas con retención de 90 días
- Auditoría completa: toda modificación a datos financieros genera un registro con usuario, IP, timestamp y valor anterior
- Política de acceso mínimo privilegio (Principle of Least Privilege) por rol y módulo

### 5.3 Roles y Permisos

| Rol | Nómina | Gastos | Publicidad | Ingresos | Reportes | Config. Sistema |
|---|---|---|---|---|---|---|
| admin | R/W | R/W | R/W | R/W | R/W | R/W |
| contador | R/W | R/W | R | R/W | R/W | — |
| operador | R | R/W | R/W | R | R | — |
| viewer | R | R | R | R | R | — |

---

## 6. Requisitos de Performance y Escalabilidad

### 6.1 SLAs y Métricas Objetivo

| Métrica | Objetivo | Crítico |
|---|---|---|
| Tiempo de respuesta API (p50) | < 100ms | < 500ms |
| Tiempo de respuesta API (p99) | < 300ms | < 1,000ms |
| Disponibilidad del sistema | >= 99.9% | >= 99.5% |
| Tiempo de carga del dashboard | < 2 segundos | < 5 segundos |
| Tiempo de generación de reporte PDF | < 5 segundos | < 15 segundos |
| Usuarios concurrentes soportados | 500 | 100 mínimo |
| Throughput de la API | >= 1,000 req/seg | >= 200 req/seg |
| Recovery Time Objective (RTO) | < 30 minutos | < 2 horas |
| Recovery Point Objective (RPO) | < 15 minutos | < 6 horas |

### 6.2 Estrategia de Caché

- **Tipos de cambio:** TTL 15 minutos en Redis, actualización automática desde proveedor externo
- **Totales de presupuesto mensual:** TTL 5 minutos, invalidación inmediata al registrar nuevo gasto
- **Datos de empleados:** TTL 1 hora, invalidación en actualizaciones
- **Reportes generados:** TTL 24 horas en almacenamiento de objetos (S3/MinIO)

---

## 7. Infraestructura y Despliegue

### 7.1 Ambientes

| Ambiente | Propósito | Infraestructura |
|---|---|---|
| Development (local) | Desarrollo individual | Docker Compose en laptop |
| Staging | Pruebas de integración y QA | Kubernetes cluster (2 nodos, cloud) |
| Production | Operación en vivo | Kubernetes cluster (5+ nodos, HA, multi-AZ) |
| DR (Disaster Recovery) | Continuidad de negocio | Región alternativa cloud, replicación async |

### 7.2 Pipeline CI/CD

Cada push a las ramas `main` y `develop` dispara el siguiente pipeline automático:

| Etapa | Herramienta | Condición de éxito |
|---|---|---|
| 1. Build | Docker multi-stage | Imagen construida sin errores |
| 2. Lint & Format | ESLint + Prettier | 0 errores, 0 warnings |
| 3. Unit Tests | Jest | Cobertura >= 80% líneas |
| 4. Integration Tests | Jest + TestContainers | Todos los tests pasan |
| 5. E2E Tests | Cypress | Flujos críticos funcionando |
| 6. Security Scan | Trivy + Snyk | 0 vulnerabilidades críticas/altas |
| 7. Deploy Staging | Helm + Kubernetes | Health checks en verde |
| 8. Smoke Tests | k6 | Latencia y throughput dentro de SLA |
| 9. Deploy Production | GitOps (ArgoCD) | Aprobación manual requerida |

### 7.3 `docker-compose.yml` — Desarrollo Local

```yaml
version: "3.9"
services:
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: budget_db
      POSTGRES_USER: budget_user
      POSTGRES_PASSWORD: localpass
    ports: ["5432:5432"]
    volumes: ["pgdata:/var/lib/postgresql/data"]

  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]

  api:
    build: ./apps/budget-api
    ports: ["3000:3000"]
    environment:
      DATABASE_URL: postgresql://budget_user:localpass@db:5432/budget_db
      REDIS_URL: redis://redis:6379
    depends_on: [db, redis]

  ui:
    build: ./apps/budget-ui
    ports: ["5173:5173"]
    depends_on: [api]

volumes:
  pgdata:
```

---

## 8. Integraciones Externas

| Integración | API / Protocolo | Propósito | Fallback |
|---|---|---|---|
| Meta (Facebook) Ads | Meta Marketing API v19 | Obtener gasto real de campañas publicitarias | Ingreso manual |
| Tipo de Cambio | BCRA API / Fixer.io | Cotización USD/ARS actualizada | Último valor conocido en Redis |
| Payway | REST API propietaria | Procesamiento de pagos (estado bonificado) | Registro manual |
| Correo Electrónico | SendGrid / SMTP | Notificaciones y envío de reportes | Cola de reintentos |
| WhatsApp Business | Meta Cloud API | Alertas de gastos que superan umbrales | Email alternativo |
| Google Drive / S3 | REST API | Almacenamiento de reportes generados | Sistema de archivos local |

---

## 9. Estrategia de Testing

### 9.1 Pirámide de Testing

| Nivel | Herramienta | Cobertura Objetivo | Responsable |
|---|---|---|---|
| Unit Tests | Jest | >= 80% del código de negocio | Desarrollador |
| Integration Tests | Jest + Supertest | Todos los endpoints de API | Desarrollador |
| E2E Tests | Cypress | Flujos críticos (nómina, gastos, reporte) | QA |
| Performance Tests | k6 | SLAs de latencia y throughput | DevOps / QA |
| Security Tests | OWASP ZAP + Trivy | OWASP Top 10, vulnerabilidades de imágenes | SecOps |
| Accesibilidad | axe-core | WCAG 2.1 AA | Frontend Dev |

### 9.2 Casos de Prueba Críticos

- **Cálculo de sueldo:** 38 horas × $3,000 + 6 días × $2,700 debe resultar exactamente en $130,200
- **Conversión de publicidad:** $1,028.97 USD × tipo de cambio $1,500 debe resultar en $1,543,455
- **Suma de gastos:** el total conjunto debe coincidir con la suma individual de todas las categorías
- **Tipo de cambio:** una actualización debe reflejarse en todos los cálculos dentro de 15 minutos
- **Estado bonificado:** un gasto con estado `bonificado` no debe sumarse al total de gastos pagados
- **Validación de neto:** $811,500 = $3,244,000 (ingresos) − $2,432,500 (costo de mercadería)

### 9.3 Ejemplo de Unit Test

```typescript
describe('SalaryService', () => {
  it('should calculate weekly salary correctly', () => {
    const result = salaryService.calculate({
      hoursWorked: 38,
      hourlyRate: 3000,
      daysWorked: 6,
      dailyViatico: 2700,
    });
    expect(result.total).toBe(130200);
    expect(result.baseSalary).toBe(114000);
    expect(result.viaticos).toBe(16200);
  });

  it('should aggregate 4 weeks correctly', () => {
    const weeks = [106200, 103200, 106200, 130200];
    expect(salaryService.sumWeeks(weeks)).toBe(445800);
  });
});
```

---

## 10. Glosario Técnico

| Término | Definición |
|---|---|
| ARS | Peso Argentino — moneda base del sistema |
| USD | Dólar estadounidense — moneda de referencia para publicidad |
| Tipo de Cambio | Relación entre ARS y USD actualizada desde fuentes externas |
| Viático | Monto fijo pagado por día trabajado para cubrir gastos de desplazamiento |
| Neto | Diferencia entre ingresos brutos y costo total de mercadería/operación |
| Bonificado | Estado especial de un gasto que ha sido condonado o cubierto por el proveedor |
| SLA | Service Level Agreement — acuerdo de nivel de servicio que define disponibilidad y performance |
| RTO | Recovery Time Objective — tiempo máximo aceptable de inactividad ante una falla |
| RPO | Recovery Point Objective — máxima pérdida de datos aceptable ante una falla |
| RBAC | Role-Based Access Control — control de acceso basado en roles de usuario |
| TTL | Time To Live — tiempo de vida de un objeto en caché antes de expirar |
| CI/CD | Continuous Integration / Continuous Deployment — automatización de build y despliegue |
| ORM | Object-Relational Mapping — abstracción entre objetos de código y tablas de base de datos |
| ACID | Atomicity, Consistency, Isolation, Durability — propiedades de transacciones en BD |
| JWT | JSON Web Token — estándar para tokens de autenticación stateless |
| SSO | Single Sign-On — autenticación única para múltiples sistemas |

---

*Confidencial — v1.0 — Febrero 2026 — Equipo de Arquitectura de Software*
