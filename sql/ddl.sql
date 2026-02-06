/* =========================
   MASTER TABLES
   ========================= */

-- Customers master
CREATE TABLE "tbl-master-customer" (
  customer_no        VARCHAR(32)    NOT NULL,
  full_name          VARCHAR(200)   NOT NULL,
  dob                DATE,
  gender             CHAR(1),
  address            VARCHAR(400),
  phone              VARCHAR(40),
  email              VARCHAR(200),

  CONSTRAINT pk_tbl_master_customer PRIMARY KEY (customer_no),
  CONSTRAINT uq_tbl_master_customer_email UNIQUE (email),
  CONSTRAINT ck_tbl_master_customer_gender CHECK (gender IN ('M','F') OR gender IS NULL)
);

-- Services master
CREATE TABLE "tbl-master-services" (
  services_no        VARCHAR(32)    NOT NULL,
  services_name      VARCHAR(200)   NOT NULL,
  status             VARCHAR(20)    NOT NULL,

  CONSTRAINT pk_tbl_master_services PRIMARY KEY (services_no),
  CONSTRAINT ck_tbl_master_services_status CHECK (status IN ('active','inactive'))
);

-- Package master (each package belongs to a service)
CREATE TABLE "tbl-master-package" (
  package_no         VARCHAR(32)    NOT NULL,
  services_no        VARCHAR(32)    NOT NULL,
  description        VARCHAR(400),
  amount             DECIMAL(12,2)  NOT NULL,
  status             VARCHAR(20)    NOT NULL,

  CONSTRAINT pk_tbl_master_package PRIMARY KEY (package_no),
  CONSTRAINT fk_tbl_master_package_service
    FOREIGN KEY (services_no) REFERENCES "tbl-master-services"(services_no),
  CONSTRAINT ck_tbl_master_package_status CHECK (status IN ('active','inactive')),
  CONSTRAINT ck_tbl_master_package_amount CHECK (amount >= 0)
);

-- Bundle master (container of 1..N packages)
CREATE TABLE "tbl-master-bundle" (
  bundle_id          VARCHAR(32)    NOT NULL,
  bundle_name        VARCHAR(200)   NOT NULL,
  description        VARCHAR(400),
  amount             DECIMAL(12,2),
  status             VARCHAR(20)    NOT NULL,

  CONSTRAINT pk_tbl_master_bundle PRIMARY KEY (bundle_id),
  CONSTRAINT ck_tbl_master_bundle_status CHECK (status IN ('active','inactive')),
  CONSTRAINT ck_tbl_master_bundle_amount CHECK (amount IS NULL OR amount >= 0)
);

-- Bundle items (which packages are inside a bundle)
CREATE TABLE "tbl-master-bundle-item" (
  bundle_id          VARCHAR(32)    NOT NULL,
  package_no         VARCHAR(32)    NOT NULL,
  qty                DECIMAL(10,2)  DEFAULT 1 NOT NULL,

  CONSTRAINT pk_tbl_master_bundle_item PRIMARY KEY (bundle_id, package_no),
  CONSTRAINT fk_tbl_bundle_item_bundle
    FOREIGN KEY (bundle_id) REFERENCES "tbl-master-bundle"(bundle_id),
  CONSTRAINT fk_tbl_bundle_item_package
    FOREIGN KEY (package_no) REFERENCES "tbl-master-package"(package_no),
  CONSTRAINT ck_tbl_bundle_item_qty CHECK (qty > 0)
);

/* =========================
   EVENTS
   ========================= */

-- Event header
CREATE TABLE "tbl-event" (
  event_no           VARCHAR(32)    NOT NULL,
  customer_no        VARCHAR(32)    NOT NULL,
  event_name         VARCHAR(200)   NOT NULL,
  event_date         DATE           NOT NULL,
  venue_name         VARCHAR(200),
  venue_address      VARCHAR(400),
  status             VARCHAR(20)    DEFAULT 'draft' NOT NULL,

  CONSTRAINT pk_tbl_event PRIMARY KEY (event_no),
  CONSTRAINT fk_tbl_event_customer
    FOREIGN KEY (customer_no) REFERENCES "tbl-master-customer"(customer_no),
  CONSTRAINT ck_tbl_event_status CHECK (status IN ('draft','confirmed','completed','cancelled'))
);

-- Event services (ad‑hoc service lines)
CREATE TABLE "tbl-event-services" (
  event_no           VARCHAR(32)    NOT NULL,
  services_no        VARCHAR(32)    NOT NULL,
  description        VARCHAR(400),
  amount             DECIMAL(12,2)  NOT NULL,
  status             VARCHAR(20)    DEFAULT 'active' NOT NULL,

  CONSTRAINT pk_tbl_event_services PRIMARY KEY (event_no, services_no),
  CONSTRAINT fk_tbl_event_services_event
    FOREIGN KEY (event_no) REFERENCES "tbl-event"(event_no),
  CONSTRAINT fk_tbl_event_services_master
    FOREIGN KEY (services_no) REFERENCES "tbl-master-services"(services_no),
  CONSTRAINT ck_tbl_event_services_amount CHECK (amount >= 0),
  CONSTRAINT ck_tbl_event_services_status CHECK (status IN ('active','void'))
);

-- Event packages (selected packages for the event)
CREATE TABLE "tbl-event-package" (
  event_no           VARCHAR(32)    NOT NULL,
  package_no         VARCHAR(32)    NOT NULL,
  description        VARCHAR(400),
  amount             DECIMAL(12,2)  NOT NULL,
  status             VARCHAR(20)    DEFAULT 'active' NOT NULL,

  CONSTRAINT pk_tbl_event_package PRIMARY KEY (event_no, package_no),
  CONSTRAINT fk_tbl_event_package_event
    FOREIGN KEY (event_no) REFERENCES "tbl-event"(event_no),
  CONSTRAINT fk_tbl_event_package_master
    FOREIGN KEY (package_no) REFERENCES "tbl-master-package"(package_no),
  CONSTRAINT ck_tbl_event_package_amount CHECK (amount >= 0),
  CONSTRAINT ck_tbl_event_package_status CHECK (status IN ('active','void'))
);

-- Event bundles (selected bundles for the event)
CREATE TABLE "tbl-event-bundle" (
  event_no           VARCHAR(32)    NOT NULL,
  bundle_id          VARCHAR(32)    NOT NULL,
  description        VARCHAR(400),
  amount             DECIMAL(12,2),
  status             VARCHAR(20)    DEFAULT 'active' NOT NULL,

  CONSTRAINT pk_tbl_event_bundle PRIMARY KEY (event_no, bundle_id),
  CONSTRAINT fk_tbl_event_bundle_event
    FOREIGN KEY (event_no) REFERENCES "tbl-event"(event_no),
  CONSTRAINT fk_tbl_event_bundle_master
    FOREIGN KEY (bundle_id) REFERENCES "tbl-master-bundle"(bundle_id),
  CONSTRAINT ck_tbl_event_bundle_amount CHECK (amount IS NULL OR amount >= 0),
  CONSTRAINT ck_tbl_event_bundle_status CHECK (status IN ('active','void'))
);

/* =========================
   WORK ORDER
   ========================= */

CREATE TABLE "tbl-work-order" (
  wo_no              VARCHAR(32)    NOT NULL,
  event_no           VARCHAR(32)    NOT NULL,
  website            VARCHAR(200),

  CONSTRAINT pk_tbl_work_order PRIMARY KEY (wo_no),
  CONSTRAINT fk_tbl_work_order_event
    FOREIGN KEY (event_no) REFERENCES "tbl-event"(event_no)
);

/* =========================
   INVOICE
   ========================= */

-- Invoice header
CREATE TABLE "tbl-invoice" (
  invoice_no         VARCHAR(32)    NOT NULL,
  invoice_date       DATE           NOT NULL,
  event_no           VARCHAR(32)    NOT NULL,
  remarks            VARCHAR(400),

  CONSTRAINT pk_tbl_invoice PRIMARY KEY (invoice_no),
  CONSTRAINT fk_tbl_invoice_event
    FOREIGN KEY (event_no) REFERENCES "tbl-event"(event_no)
);

-- Invoice lines
CREATE TABLE "tbl-invoice-line" (
  invoice_no         VARCHAR(32)    NOT NULL,
  line_no            INTEGER        NOT NULL,
  line_type          VARCHAR(20)    NOT NULL,  -- 'service' | 'package' | 'bundle' | 'custom'
  services_no        VARCHAR(32),
  package_no         VARCHAR(32),
  bundle_id          VARCHAR(32),
  description        VARCHAR(400)   NOT NULL,
  qty                DECIMAL(10,2)  DEFAULT 1 NOT NULL,
  amount             DECIMAL(12,2)  NOT NULL,

  CONSTRAINT pk_tbl_invoice_line PRIMARY KEY (invoice_no, line_no),
  CONSTRAINT fk_tbl_invoice_line_invoice
    FOREIGN KEY (invoice_no) REFERENCES "tbl-invoice"(invoice_no),
  CONSTRAINT fk_tbl_invoice_line_service
    FOREIGN KEY (services_no) REFERENCES "tbl-master-services"(services_no),
  CONSTRAINT fk_tbl_invoice_line_package
    FOREIGN KEY (package_no) REFERENCES "tbl-master-package"(package_no),
  CONSTRAINT fk_tbl_invoice_line_bundle
    FOREIGN KEY (bundle_id) REFERENCES "tbl-master-bundle"(bundle_id),
  CONSTRAINT ck_tbl_invoice_line_type CHECK (line_type IN ('service','package','bundle','custom')),
  CONSTRAINT ck_tbl_invoice_line_qty CHECK (qty > 0),
  CONSTRAINT ck_tbl_invoice_line_amount CHECK (amount >= 0)
);

/* =========================
   RECEIPT (for invoice payments)
   ========================= */

CREATE TABLE "tbl-receipt" (
  receipt_no         VARCHAR(32)    NOT NULL,
  receipt_date       DATE           NOT NULL,
  invoice_no         VARCHAR(32)    NOT NULL,
  amount             DECIMAL(12,2)  NOT NULL,
  remarks            VARCHAR(400),

  CONSTRAINT pk_tbl_receipt PRIMARY KEY (receipt_no),
  CONSTRAINT fk_tbl_receipt_invoice
    FOREIGN KEY (invoice_no) REFERENCES "tbl-invoice"(invoice_no),
  CONSTRAINT ck_tbl_receipt_amount CHECK (amount > 0)
);

/* =========================
   OPTIONAL INDEXES
   (SQL-92 syntax is CREATE INDEX; availability/details vary by RDBMS)
   ========================= */
-- CREATE INDEX idx_tbl_event_customer ON "tbl-event"(customer_no);
-- CREATE INDEX idx_tbl_invoice_event  ON "tbl-invoice"(event_no);
