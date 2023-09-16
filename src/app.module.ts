import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductosModule } from './productos/productos.module';
import { QuienesSomosModule } from './quienes-somos/quienes-somos.module';
import { AyudaModule } from './ayuda/ayuda.module';
import { CarritoDeCompraModule } from './carrito-de-compra/carrito-de-compra.module';
import { UsuarioModule } from './usuario/usuario.module';
import { BuscadorModule } from './buscador/buscador.module';

import { PacksModule } from './packs/packs.module';
import { PromosModule } from './promos/promos.module';

@Module({
  imports: [
    ProductosModule,
    QuienesSomosModule,
    AyudaModule,
    CarritoDeCompraModule,
    UsuarioModule,
    BuscadorModule,
    PacksModule,
    PromosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
