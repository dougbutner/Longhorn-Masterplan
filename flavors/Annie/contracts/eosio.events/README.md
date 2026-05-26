# eosio.events (Annie)

Status: scaffolding
Upstream: new
Upstream-path: 

## Surface

```cpp
ACTION register_schema(name event_type, std::string abi_fragment);
ACTION emit_event(name event_type, std::vector<char> data); // privileged-only callable
```

`emit_event` is callable via inline action from any contract; the chain records it on the block alongside action traces.
