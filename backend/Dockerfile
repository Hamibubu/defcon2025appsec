FROM php:8.3-apache-bullseye

RUN apt-get update && apt-get install -y \
    unzip \
    zip \
    git \
    curl \
    libzip-dev \
    libonig-dev \
    libxml2-dev \
    libpq-dev \
    libcurl4-openssl-dev \
    && docker-php-ext-install pdo pdo_mysql zip

RUN a2enmod rewrite

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

WORKDIR /var/www/html

COPY . .

COPY ../.env .env

# Ensure images directory and access.log file exist
RUN mkdir -p /var/www/html/images && \
    touch /var/www/html/api/v1/access.log && \
    composer install && \
    chown -R www-data:www-data /var/www/html && \
    chmod -R 755 /var/www/html && \
    chmod 664 /var/www/html/api/v1/access.log && \
    chown www-data:www-data /var/www/html/api/v1/access.log

EXPOSE 80
