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

RUN composer install

RUN chown -R www-data:www-data /var/www/html

EXPOSE 80
