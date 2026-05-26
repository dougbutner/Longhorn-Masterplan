# eosio.subsidy (Annie)

Status: scaffolding
Upstream: new
Upstream-path: 

## Surface

```cpp
ACTION grantfree(name receiver, uint32_t cpu_ms, uint32_t net_bytes);
ACTION setcurve(uint8_t curve_id, std::vector<uint64_t> params);
```

Subsidy curves govern per-block refill of free-tier buckets, and are tuneable by BP vote without a hard fork.
