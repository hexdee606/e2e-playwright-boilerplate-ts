/**
 * Service page for Fake Store REST operations used by backend BDD scenarios.
 * It delegates transport and environment handling to the shared ApiHelper.
 */
import ApiHelper from "@ApiHelper";

class FakeStorePage {
    async getProductById(productId: string | number) {
        return await ApiHelper.sendGetRequest(`/products/${productId}`);
    }
}

export default new FakeStorePage();
