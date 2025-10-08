interface Province {
  code: number;
  name: string;
  division_type: string;
  codename: string;
  phone_code: number;
  districts: District[];
}

interface District {
  code: number;
  name: string;
  division_type: string;
  codename: string;
  province_code: number;
  wards: Ward[];
}

interface Ward {
  code: number;
  name: string;
  division_type: string;
  codename: string;
  district_code: number;
}

class VietnamAddressService {
  private baseUrl = 'https://provinces.open-api.vn/api';

  // Lấy tất cả tỉnh thành
  async getProvinces(): Promise<Province[]> {
    try {
      const response = await fetch(`${this.baseUrl}/p/`);
      if (!response.ok) {
        throw new Error('Failed to fetch provinces');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching provinces:', error);
      throw error;
    }
  }

  // Lấy tỉnh theo mã code (bao gồm districts)
  async getProvinceWithDistricts(provinceCode: number): Promise<Province> {
    try {
      const response = await fetch(`${this.baseUrl}/p/${provinceCode}?depth=2`);
      if (!response.ok) {
        throw new Error('Failed to fetch province with districts');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching province with districts:', error);
      throw error;
    }
  }

  // Lấy quận/huyện theo mã tỉnh
  async getDistrictsByProvinceCode(provinceCode: number): Promise<District[]> {
    try {
      const response = await fetch(`${this.baseUrl}/p/${provinceCode}?depth=2`);
      if (!response.ok) {
        throw new Error('Failed to fetch districts');
      }
      const province: Province = await response.json();
      return province.districts || [];
    } catch (error) {
      console.error('Error fetching districts:', error);
      throw error;
    }
  }

  // Lấy phường/xã theo mã quận/huyện
  async getWardsByDistrictCode(districtCode: number): Promise<Ward[]> {
    try {
      const response = await fetch(`${this.baseUrl}/d/${districtCode}?depth=2`);
      if (!response.ok) {
        throw new Error('Failed to fetch wards');
      }
      const district: District = await response.json();
      return district.wards || [];
    } catch (error) {
      console.error('Error fetching wards:', error);
      throw error;
    }
  }

  // Tìm tỉnh theo tên
  findProvinceByName(
    provinces: Province[],
    name: string,
  ): Province | undefined {
    return provinces.find(
      (p) =>
        p.name.toLowerCase().includes(name.toLowerCase()) ||
        p.codename.toLowerCase().includes(name.toLowerCase()),
    );
  }

  // Tìm quận/huyện theo tên
  findDistrictByName(
    districts: District[],
    name: string,
  ): District | undefined {
    return districts.find(
      (d) =>
        d.name.toLowerCase().includes(name.toLowerCase()) ||
        d.codename.toLowerCase().includes(name.toLowerCase()),
    );
  }

  // Tìm phường/xã theo tên
  findWardByName(wards: Ward[], name: string): Ward | undefined {
    return wards.find(
      (w) =>
        w.name.toLowerCase().includes(name.toLowerCase()) ||
        w.codename.toLowerCase().includes(name.toLowerCase()),
    );
  }
}

const vietnamAddressService = new VietnamAddressService();
export default vietnamAddressService;
export type { Province, District, Ward };
