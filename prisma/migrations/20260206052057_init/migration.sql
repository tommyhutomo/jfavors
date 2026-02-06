-- CreateTable
CREATE TABLE "tbl-master-customer" (
    "customer_no" VARCHAR(32) NOT NULL,
    "full_name" VARCHAR(200) NOT NULL,
    "dob" DATE,
    "gender" CHAR(1),
    "address" VARCHAR(400),
    "phone" VARCHAR(40),
    "email" VARCHAR(200),

    CONSTRAINT "tbl-master-customer_pkey" PRIMARY KEY ("customer_no")
);

-- CreateTable
CREATE TABLE "tbl-master-services" (
    "services_no" VARCHAR(32) NOT NULL,
    "services_name" VARCHAR(200) NOT NULL,
    "status" VARCHAR(20) NOT NULL,

    CONSTRAINT "tbl-master-services_pkey" PRIMARY KEY ("services_no")
);

-- CreateTable
CREATE TABLE "tbl-master-package" (
    "package_no" VARCHAR(32) NOT NULL,
    "services_no" VARCHAR(32) NOT NULL,
    "description" VARCHAR(400),
    "amount" DECIMAL(12,2) NOT NULL,
    "status" VARCHAR(20) NOT NULL,

    CONSTRAINT "tbl-master-package_pkey" PRIMARY KEY ("package_no")
);

-- CreateTable
CREATE TABLE "tbl-master-bundle" (
    "bundle_id" VARCHAR(32) NOT NULL,
    "bundle_name" VARCHAR(200) NOT NULL,
    "description" VARCHAR(400),
    "amount" DECIMAL(12,2),
    "status" VARCHAR(20) NOT NULL,

    CONSTRAINT "tbl-master-bundle_pkey" PRIMARY KEY ("bundle_id")
);

-- CreateTable
CREATE TABLE "tbl-master-bundle-item" (
    "bundle_id" VARCHAR(32) NOT NULL,
    "package_no" VARCHAR(32) NOT NULL,
    "qty" DECIMAL(10,2) NOT NULL DEFAULT 1,

    CONSTRAINT "tbl-master-bundle-item_pkey" PRIMARY KEY ("bundle_id","package_no")
);

-- CreateTable
CREATE TABLE "tbl-event" (
    "event_no" VARCHAR(32) NOT NULL,
    "customer_no" VARCHAR(32) NOT NULL,
    "event_name" VARCHAR(200) NOT NULL,
    "event_date" DATE NOT NULL,
    "venue_name" VARCHAR(200),
    "venue_address" VARCHAR(400),
    "status" VARCHAR(20) NOT NULL DEFAULT 'draft',

    CONSTRAINT "tbl-event_pkey" PRIMARY KEY ("event_no")
);

-- CreateTable
CREATE TABLE "tbl-event-services" (
    "event_no" VARCHAR(32) NOT NULL,
    "services_no" VARCHAR(32) NOT NULL,
    "description" VARCHAR(400),
    "amount" DECIMAL(12,2) NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'active',

    CONSTRAINT "tbl-event-services_pkey" PRIMARY KEY ("event_no","services_no")
);

-- CreateTable
CREATE TABLE "tbl-event-package" (
    "event_no" VARCHAR(32) NOT NULL,
    "package_no" VARCHAR(32) NOT NULL,
    "description" VARCHAR(400),
    "amount" DECIMAL(12,2) NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'active',

    CONSTRAINT "tbl-event-package_pkey" PRIMARY KEY ("event_no","package_no")
);

-- CreateTable
CREATE TABLE "tbl-event-bundle" (
    "event_no" VARCHAR(32) NOT NULL,
    "bundle_id" VARCHAR(32) NOT NULL,
    "description" VARCHAR(400),
    "amount" DECIMAL(12,2),
    "status" VARCHAR(20) NOT NULL DEFAULT 'active',

    CONSTRAINT "tbl-event-bundle_pkey" PRIMARY KEY ("event_no","bundle_id")
);

-- CreateTable
CREATE TABLE "tbl-work-order" (
    "wo_no" VARCHAR(32) NOT NULL,
    "event_no" VARCHAR(32) NOT NULL,
    "website" VARCHAR(200),

    CONSTRAINT "tbl-work-order_pkey" PRIMARY KEY ("wo_no")
);

-- CreateTable
CREATE TABLE "tbl-invoice" (
    "invoice_no" VARCHAR(32) NOT NULL,
    "invoice_date" DATE NOT NULL,
    "event_no" VARCHAR(32) NOT NULL,
    "remarks" VARCHAR(400),

    CONSTRAINT "tbl-invoice_pkey" PRIMARY KEY ("invoice_no")
);

-- CreateTable
CREATE TABLE "tbl-invoice-line" (
    "invoice_no" VARCHAR(32) NOT NULL,
    "line_no" INTEGER NOT NULL,
    "line_type" VARCHAR(20) NOT NULL,
    "services_no" VARCHAR(32),
    "package_no" VARCHAR(32),
    "bundle_id" VARCHAR(32),
    "description" VARCHAR(400) NOT NULL,
    "qty" DECIMAL(10,2) NOT NULL DEFAULT 1,
    "amount" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "tbl-invoice-line_pkey" PRIMARY KEY ("invoice_no","line_no")
);

-- CreateTable
CREATE TABLE "tbl-receipt" (
    "receipt_no" VARCHAR(32) NOT NULL,
    "receipt_date" DATE NOT NULL,
    "invoice_no" VARCHAR(32) NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "remarks" VARCHAR(400),

    CONSTRAINT "tbl-receipt_pkey" PRIMARY KEY ("receipt_no")
);

-- CreateIndex
CREATE UNIQUE INDEX "tbl-master-customer_email_key" ON "tbl-master-customer"("email");

-- CreateIndex
CREATE INDEX "tbl-event_customer_no_idx" ON "tbl-event"("customer_no");

-- CreateIndex
CREATE INDEX "tbl-invoice_event_no_idx" ON "tbl-invoice"("event_no");

-- AddForeignKey
ALTER TABLE "tbl-master-package" ADD CONSTRAINT "tbl-master-package_services_no_fkey" FOREIGN KEY ("services_no") REFERENCES "tbl-master-services"("services_no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl-master-bundle-item" ADD CONSTRAINT "tbl-master-bundle-item_bundle_id_fkey" FOREIGN KEY ("bundle_id") REFERENCES "tbl-master-bundle"("bundle_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl-master-bundle-item" ADD CONSTRAINT "tbl-master-bundle-item_package_no_fkey" FOREIGN KEY ("package_no") REFERENCES "tbl-master-package"("package_no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl-event" ADD CONSTRAINT "tbl-event_customer_no_fkey" FOREIGN KEY ("customer_no") REFERENCES "tbl-master-customer"("customer_no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl-event-services" ADD CONSTRAINT "tbl-event-services_event_no_fkey" FOREIGN KEY ("event_no") REFERENCES "tbl-event"("event_no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl-event-services" ADD CONSTRAINT "tbl-event-services_services_no_fkey" FOREIGN KEY ("services_no") REFERENCES "tbl-master-services"("services_no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl-event-package" ADD CONSTRAINT "tbl-event-package_event_no_fkey" FOREIGN KEY ("event_no") REFERENCES "tbl-event"("event_no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl-event-package" ADD CONSTRAINT "tbl-event-package_package_no_fkey" FOREIGN KEY ("package_no") REFERENCES "tbl-master-package"("package_no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl-event-bundle" ADD CONSTRAINT "tbl-event-bundle_event_no_fkey" FOREIGN KEY ("event_no") REFERENCES "tbl-event"("event_no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl-event-bundle" ADD CONSTRAINT "tbl-event-bundle_bundle_id_fkey" FOREIGN KEY ("bundle_id") REFERENCES "tbl-master-bundle"("bundle_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl-work-order" ADD CONSTRAINT "tbl-work-order_event_no_fkey" FOREIGN KEY ("event_no") REFERENCES "tbl-event"("event_no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl-invoice" ADD CONSTRAINT "tbl-invoice_event_no_fkey" FOREIGN KEY ("event_no") REFERENCES "tbl-event"("event_no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl-invoice-line" ADD CONSTRAINT "tbl-invoice-line_invoice_no_fkey" FOREIGN KEY ("invoice_no") REFERENCES "tbl-invoice"("invoice_no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl-invoice-line" ADD CONSTRAINT "tbl-invoice-line_services_no_fkey" FOREIGN KEY ("services_no") REFERENCES "tbl-master-services"("services_no") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl-invoice-line" ADD CONSTRAINT "tbl-invoice-line_package_no_fkey" FOREIGN KEY ("package_no") REFERENCES "tbl-master-package"("package_no") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl-invoice-line" ADD CONSTRAINT "tbl-invoice-line_bundle_id_fkey" FOREIGN KEY ("bundle_id") REFERENCES "tbl-master-bundle"("bundle_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl-receipt" ADD CONSTRAINT "tbl-receipt_invoice_no_fkey" FOREIGN KEY ("invoice_no") REFERENCES "tbl-invoice"("invoice_no") ON DELETE RESTRICT ON UPDATE CASCADE;
