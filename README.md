# Generador para proyectos frontend

Generador enfocado a desarrollo personal


# Tipos de App

- **Simple Web App** — Generador basico de pagina html sin ambientes
- **Full Pack Web App** - Generador de ambiente de desarrollo de vistas, com ambiente de desarrollo y produccion
- **Angular App** - Generador basico de angular
- **Restify App** - RestApi basico con mongose
- **Admin Web App** - Generador de administratorrapido basado en angular

# Getting Started

**Installation**

Se tiene que tener instalado  [NodeJS](http://nodejs.org/) & [Yeoman](http://yeoman.io/).
```````
npm install -g yo
````````

Install stt generator
```````
npm install --global generator-stt
```````

**Creando un proyecto**

- Corre `yo stt`
- Responde las simples preguntas de la terminal
- El generador crea y configura todo automaticamente

- Si la instalaciòn fue satisfactoria, ve a la siguiente sección
- En caso de error mira lo siguiente
    - a) cd a la carpeta del proyecyo
    - b) corre `bower install & npm install` como administrador

**Corriendo el proyecto**

En este momento ya esta todo configurado, asi que es el momento de colocar manos a la obra

- Corre `gulp` para correr el servidor, y ya puedes comenzar tu desarrollo.


# Comandos rapidos

Comandos de terminal para simplificar nuestras tareas.

#### General - se aplican para Fullpack y angular

* **Clean** _Remueve todos los archivos de tu carpeta build_

  ```````
  gulp clean
  ```````

* **Zip** _Comprime tu app y la salva en `zip`_

  ```````
  gulp zip
  ```````

#### Angular App

* **Controller** _Crea un controlador en `app/js/controllers`_

  ```````
  yo stt:controller <name>
  ```````

* **Service** _Crea un servicio un servicio en `app/js/services`_

  ```````
  yo stt:service <name>
  ```````

* **Directive** _Crea una directiva en `app/js/directives`_

  ```````
  yo stt:directive <name>
  ```````

* **Filter** _Crea un filter en `app/js/filters`_

  ```````
  yo stt:filter <name>
  ```````

# Environment

Generador stt tiene dos ambientes, uno de desarrollo y otro de producción. Por defecto corre en ambiente de desarrollo.

Se puede cambiar de ambiente con el siguiente comando.

```````
gulp prod
```````

# Bower Components

Tip: Cuando instales nuevos componentes de bower , ten la certeza de no tener tu nuevo componente en tu `bower.json`

```````
bower install <bower-component-name> --save
```````

El comando adicionara automaticamente el paquete a tu `bower.json`

# Creditos

Este proyecto tomo como base el generador [[Generator-smacss](https://github.com/FuelFrontend/generator-smacss)
