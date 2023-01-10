/**
 * Class containing the ShopParams (filters) to apply;
 * It's a class because in a class you can initialize the values
 */
export class ShopParams {
    brandId: number = 0;
    typeId: number = 0;
    sort = 'name';
    pageNumber = 1;
    pageSize = 6;
    search: string;
}
