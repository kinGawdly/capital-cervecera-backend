import { BadRequestException, Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductoDto } from './dto/producto-create.dto';
import { UpdateProductoDto } from './dto/producto-update.dto';
import { ProductoDto } from './dto/producto.dto';
import { Producto } from './entity/producto.entity';
import { ProductoMapper } from './mapper/producto.mapper';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private productoRepository: Repository<Producto>,
  ) {}

  async getAllProductos(query: any): Promise<ProductoDto[]> {
    const resultado: Producto[] = await this.productoRepository.find({
      relations: {
        casa_cervecera: true,
        packs: true,
        contacto_productos: true,
      },
    });

    const productos = ProductoMapper.toDtoList(resultado);

    let filteredProduct = [...productos];
    Object.keys(query).forEach((item) => {
      if (item === 'is_recomendado') {
        filteredProduct = filteredProduct.filter((prod) => {
          if (query.is_recomendado === 'false') {
            return prod.is_recomendado == false;
          }
          return prod.is_recomendado == true;
        });

        return;
      }
      if (item === 'precio_minimo') {
        filteredProduct = filteredProduct.filter(
          (prod) => prod.precio_venta >= +query[item],
        );
        return;
      }
      if (item === 'precio_maximo') {
        filteredProduct = filteredProduct.filter(
          (prod) => prod.precio_venta <= +query[item],
        );
        return;
      }
      if (item === 'is_promo') {
        filteredProduct = filteredProduct.filter((prod) => {
          if (query.is_promo === 'false') {
            return prod.is_promo == false;
          }
          return prod.is_promo == true;
        });
      }
      if (item === 'a-z' && query[item] === 'true') {
        filteredProduct = filteredProduct.sort((a, b) =>
          a.nombre_producto.localeCompare(b.nombre_producto),
        );
      }

      if (item === 'z-a' && query[item] === 'true') {
        filteredProduct = filteredProduct.sort((a, b) =>
          b.nombre_producto.localeCompare(a.nombre_producto),
        );
      }
      filteredProduct = filteredProduct.filter((prod) => {
        console.log(prod);
        return prod[item] == query[item];
      });
    });

    return filteredProduct;
  }

  async getProductoById(id: number): Promise<ProductoDto> {
    const resultado: Producto = await this.productoRepository.findOne({
      where: {
        id: id,
      },
      relations: {
        casa_cervecera: true,
        packs: true,
        contacto_productos: true,
      },
    });

    if (!resultado) {
      throw new BadRequestException();
    }
    return ProductoMapper.toDto(resultado);
  }

  async getPromos() {
    const resultado: Producto[] = await this.productoRepository.find({
      where: {
        is_promo: true,
      },
      relations: {
        contacto_productos: true,
      },
    });

    return ProductoMapper.toDtoList(resultado);
  }

  async getRecomendados() {
    const resultado = await this.productoRepository.find({
      where: {
        is_recomendado: true,
      },
      relations: {
        contacto_productos: true,
      },
    });

    return ProductoMapper.toDtoList(resultado);
  }

  async create(createProductoDto: CreateProductoDto): Promise<ProductoDto> {
    const existe: boolean = await this.productoRepository.exist({
      where: {
        nombre_producto: createProductoDto.nombre_producto,
      },
    });

    if (existe) {
      throw Error('Ya existe un producto con ese nombre');
    }

    const entidad: Producto = await ProductoMapper.toEntity(createProductoDto);

    const resultado: Producto = await this.productoRepository.save(entidad);

    const resultadoWithRelation = await this.productoRepository.findOne({
      where: {
        id: resultado.id,
      },
      relations: {
        casa_cervecera: true,
        contacto_productos: true,
      },
    });

    return ProductoMapper.toDto(resultadoWithRelation);
  }
  async remove(id: number): Promise<ProductoDto> {
    const encontrado: Producto = await this.productoRepository.findOne({
      where: {
        id: id,
      },
      relations: {
        contacto_productos: true,
      },
    });
    if (!encontrado) {
      throw Error('No se encontró el producto');
    }
    await this.productoRepository.remove(encontrado);
    return ProductoMapper.toDto(encontrado);
  }

  async update(
    id: number,
    updateProductoDto: UpdateProductoDto,
  ): Promise<ProductoDto> {
    const encontrado: Producto = await this.productoRepository.findOne({
      where: {
        id: id,
      },

      relations: {
        casa_cervecera: true,
      },
    });

    if (!encontrado) {
      throw Error('No se encontró el producto');
    }

    if (updateProductoDto.amargor_ibu) {
      encontrado.amargor_ibu = updateProductoDto.amargor_ibu;
    }
    if (updateProductoDto.grado_alcoholico) {
      encontrado.grado_alcoholico = updateProductoDto.grado_alcoholico;
    }
    if (updateProductoDto.nombre_producto) {
      encontrado.nombre_producto = updateProductoDto.nombre_producto;
    }

    if (updateProductoDto.precio_venta) {
      encontrado.precio_venta = updateProductoDto.precio_venta;
    }
    if (updateProductoDto.is_recomendado) {
      encontrado.is_recomendado = updateProductoDto.is_recomendado;
    }
    if (updateProductoDto.casa_cervecera_id) {
      encontrado.casa_cervecera_id = updateProductoDto.casa_cervecera_id;
    }

    if (updateProductoDto.tipo) {
      encontrado.tipo = updateProductoDto.tipo;
    }

    if (updateProductoDto.base64_imagen_card) {
      encontrado.base64_imagen_card = updateProductoDto.base64_imagen_card;
    }

    if (updateProductoDto.base64_imagen_detalle) {
      encontrado.base64_imagen_detalle =
        updateProductoDto.base64_imagen_detalle;
    }

    if (updateProductoDto.detalle) {
      encontrado.detalle = updateProductoDto.detalle;
    }

    if (updateProductoDto.sku) {
      encontrado.sku = updateProductoDto.sku;
    }

    if (updateProductoDto.volumen_cc) {
      encontrado.volumen_cc = updateProductoDto.volumen_cc;
    }

    if (updateProductoDto.stock) {
      encontrado.stock = updateProductoDto.stock;
    }

    if (updateProductoDto.precio_descuento) {
      encontrado.precio_descuento = updateProductoDto.precio_descuento;
    }

    if (updateProductoDto.is_promo) {
      encontrado.is_promo = updateProductoDto.is_promo;
    }

    const resultado: Producto = await this.productoRepository.save(encontrado);

    const resultadoWithRelation = await this.productoRepository.findOne({
      where: {
        id: resultado.id,
      },
      relations: {
        casa_cervecera: true,
        packs: true,
      },
    });

    return ProductoMapper.toDto(resultadoWithRelation);
  }
}
